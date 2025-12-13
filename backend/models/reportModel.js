const db = require('../config/db.config');

const ReportModel = {
  // Create Report
  createReport: async (reportData) => {
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();
      
      const {
        patient_id,
        doctor_id,
        test_ids,
        report_date,
        sample_collection_date,
        notes,
        priority,
        tenant_id
      } = reportData;

      // Create main report
      const [reportResult] = await connection.query(
        `INSERT INTO lab_reports (
          tenant_id, patient_id, doctor_id, report_date, 
          sample_collection_date, notes, priority, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`,
        [
          tenant_id,
          patient_id,
          doctor_id,
          report_date,
          sample_collection_date,
          notes || null,
          priority || 'normal'
        ]
      );

      const reportId = reportResult.insertId;

      // Add test items to report
      if (test_ids && test_ids.length > 0) {
        for (const testId of test_ids) {
          await connection.query(
            `INSERT INTO lab_report_tests (report_id, test_id) VALUES (?, ?)`,
            [reportId, testId]
          );
        }
      }

      await connection.commit();
      return { reportId, success: true };
      
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  // Get All Reports
  getAllReports: async (tenantId, filters = {}) => {
    let query = `
      SELECT 
        lr.*,
        p.patient_name,
        p.age as patient_age,
        p.phone as patient_phone,
        d.doctor_name,
        d.specialization as doctor_specialization,
        COUNT(lrt.test_id) as test_count
      FROM lab_reports lr
      LEFT JOIN patients p ON lr.patient_id = p.id
      LEFT JOIN referring_doctors d ON lr.doctor_id = d.doctor_id
      LEFT JOIN lab_report_tests lrt ON lr.report_id = lrt.report_id
      WHERE lr.tenant_id = ?
    `;
    
    const params = [tenantId];

    if (filters.status) {
      query += ` AND lr.status = ?`;
      params.push(filters.status);
    }

    if (filters.patient_id) {
      query += ` AND lr.patient_id = ?`;
      params.push(filters.patient_id);
    }

    if (filters.doctor_id) {
      query += ` AND lr.doctor_id = ?`;
      params.push(filters.doctor_id);
    }

    if (filters.from_date) {
      query += ` AND lr.report_date >= ?`;
      params.push(filters.from_date);
    }

    if (filters.to_date) {
      query += ` AND lr.report_date <= ?`;
      params.push(filters.to_date);
    }

    query += ` GROUP BY lr.report_id ORDER BY lr.report_date DESC, lr.report_id DESC`;

    const [reports] = await db.query(query, params);
    return reports;
  },

  // Get Report by ID
  getReportById: async (reportId, tenantId) => {
    const [reports] = await db.query(
      `SELECT 
        lr.*,
        p.patient_name,
        p.age as patient_age,
        p.phone as patient_phone,
        p.gender as patient_gender,
        p.address as patient_address,
        d.doctor_name,
        d.specialization as doctor_specialization,
        d.qualification as doctor_qualification
      FROM lab_reports lr
      LEFT JOIN patients p ON lr.patient_id = p.id
      LEFT JOIN referring_doctors d ON lr.doctor_id = d.doctor_id
      WHERE lr.report_id = ? AND lr.tenant_id = ?`,
      [reportId, tenantId]
    );

    if (reports.length === 0) return null;

    const report = reports[0];

    // Get tests for this report
    const [tests] = await db.query(
      `SELECT 
        lrt.*,
        ltm.test_name,
        ltm.unit,
        ltm.ref_value,
        ltm.test_type,
        ltm.parent_test_id
      FROM lab_report_tests lrt
      JOIN lab_test_master ltm ON lrt.test_id = ltm.test_id
      WHERE lrt.report_id = ?
      ORDER BY ltm.test_name`,
      [reportId]
    );

    report.tests = tests;
    return report;
  },

  // Update Report Status
  updateReportStatus: async (reportId, tenantId, status, verifiedBy = null, doctorComments = null) => {
    const updateData = {
      status,
      updated_at: new Date()
    };

    if (status === 'verified' && verifiedBy) {
      updateData.verified_by = verifiedBy;
      updateData.verified_at = new Date();
    }

    if (doctorComments) {
      updateData.doctor_comments = doctorComments;
    }

    const fields = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updateData);
    values.push(reportId, tenantId);

    const [result] = await db.query(
      `UPDATE lab_reports SET ${fields} WHERE report_id = ? AND tenant_id = ?`,
      values
    );

    return result.affectedRows > 0;
  },

  // Add Test Results
  addTestResults: async (reportId, testId, results, technicianId = 1) => {
    const [result] = await db.query(
      `UPDATE lab_report_tests SET 
        result_value = ?,
        result_status = ?,
        technician_notes = ?,
        technician_id = ?,
        entered_at = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
      WHERE report_id = ? AND test_id = ?`,
      [
        results.result_value,
        results.result_status || 'normal',
        results.technician_notes || null,
        technicianId,
        reportId,
        testId
      ]
    );

    // Update report status to in_progress if it was pending
    await db.query(
      `UPDATE lab_reports SET 
        status = CASE 
          WHEN status = 'pending' THEN 'in_progress'
          ELSE status 
        END,
        technician_id = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE report_id = ?`,
      [technicianId, reportId]
    );

    return result.affectedRows > 0;
  },

  // Get Report Statistics
  getReportStats: async (tenantId) => {
    const [stats] = await db.query(
      `SELECT 
        COUNT(*) as total_reports,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_reports,
        SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress_reports,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_reports,
        SUM(CASE WHEN status = 'verified' THEN 1 ELSE 0 END) as verified_reports,
        SUM(CASE WHEN DATE(report_date) = CURDATE() THEN 1 ELSE 0 END) as today_reports
      FROM lab_reports
      WHERE tenant_id = ?`,
      [tenantId]
    );

    return stats[0];
  },

  // Delete Report
  deleteReport: async (reportId, tenantId) => {
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();

      // Delete test results first
      await connection.query(
        `DELETE FROM lab_report_tests WHERE report_id = ?`,
        [reportId]
      );

      // Delete main report
      const [result] = await connection.query(
        `DELETE FROM lab_reports WHERE report_id = ? AND tenant_id = ?`,
        [reportId, tenantId]
      );

      await connection.commit();
      return result.affectedRows > 0;
      
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  // Get Reports for Patient
  getPatientReports: async (patientId, tenantId) => {
    const [reports] = await db.query(
      `SELECT 
        lr.*,
        d.doctor_name,
        d.specialization as doctor_specialization,
        COUNT(lrt.test_id) as test_count
      FROM lab_reports lr
      LEFT JOIN referring_doctors d ON lr.doctor_id = d.doctor_id
      LEFT JOIN lab_report_tests lrt ON lr.report_id = lrt.report_id
      WHERE lr.patient_id = ? AND lr.tenant_id = ?
      GROUP BY lr.report_id
      ORDER BY lr.report_date DESC`,
      [patientId, tenantId]
    );

    return reports;
  }
};

module.exports = ReportModel;