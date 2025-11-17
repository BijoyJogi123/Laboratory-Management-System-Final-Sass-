const db = require('../config/db.config');

const DoctorModel = {
  // Create Doctor
  createDoctor: async (doctorData) => {
    const [result] = await db.query(
      `INSERT INTO referring_doctors (
        tenant_id, doctor_name, specialization, qualification,
        registration_number, contact_number, email, address,
        commission_type, commission_value, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        doctorData.tenant_id,
        doctorData.doctor_name,
        doctorData.specialization,
        doctorData.qualification,
        doctorData.registration_number,
        doctorData.contact_number,
        doctorData.email,
        doctorData.address,
        doctorData.commission_type || 'none',
        doctorData.commission_value || 0,
        doctorData.is_active !== false
      ]
    );
    return { doctorId: result.insertId, success: true };
  },

  // Get All Doctors
  getAllDoctors: async (tenantId, filters = {}) => {
    let query = `SELECT * FROM referring_doctors WHERE tenant_id = ?`;
    const params = [tenantId];

    if (filters.is_active !== undefined) {
      query += ` AND is_active = ?`;
      params.push(filters.is_active);
    }

    if (filters.specialization) {
      query += ` AND specialization = ?`;
      params.push(filters.specialization);
    }

    if (filters.search) {
      query += ` AND (doctor_name LIKE ? OR registration_number LIKE ?)`;
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    query += ` ORDER BY doctor_name`;

    const [doctors] = await db.query(query, params);
    return doctors;
  },

  // Get Doctor by ID
  getDoctorById: async (doctorId, tenantId) => {
    const [doctors] = await db.query(
      `SELECT * FROM referring_doctors WHERE doctor_id = ? AND tenant_id = ?`,
      [doctorId, tenantId]
    );
    return doctors.length > 0 ? doctors[0] : null;
  },

  // Update Doctor
  updateDoctor: async (doctorId, tenantId, updateData) => {
    const [result] = await db.query(
      `UPDATE referring_doctors SET
        doctor_name = ?,
        specialization = ?,
        qualification = ?,
        registration_number = ?,
        contact_number = ?,
        email = ?,
        address = ?,
        commission_type = ?,
        commission_value = ?,
        is_active = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE doctor_id = ? AND tenant_id = ?`,
      [
        updateData.doctor_name,
        updateData.specialization,
        updateData.qualification,
        updateData.registration_number,
        updateData.contact_number,
        updateData.email,
        updateData.address,
        updateData.commission_type,
        updateData.commission_value,
        updateData.is_active,
        doctorId,
        tenantId
      ]
    );
    return result.affectedRows > 0;
  },

  // Delete Doctor
  deleteDoctor: async (doctorId, tenantId) => {
    const [result] = await db.query(
      `DELETE FROM referring_doctors WHERE doctor_id = ? AND tenant_id = ?`,
      [doctorId, tenantId]
    );
    return result.affectedRows > 0;
  },

  // Record Commission
  recordCommission: async (commissionData) => {
    const [result] = await db.query(
      `INSERT INTO doctor_commissions (
        tenant_id, doctor_id, invoice_id, test_amount,
        commission_amount, commission_date, payment_status, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        commissionData.tenant_id,
        commissionData.doctor_id,
        commissionData.invoice_id,
        commissionData.test_amount,
        commissionData.commission_amount,
        commissionData.commission_date || new Date(),
        'pending',
        commissionData.notes
      ]
    );
    return { commissionId: result.insertId, success: true };
  },

  // Get Doctor Commissions
  getDoctorCommissions: async (doctorId, tenantId, fromDate, toDate) => {
    const [commissions] = await db.query(
      `SELECT dc.*, i.invoice_number, i.patient_name
       FROM doctor_commissions dc
       JOIN invoices i ON dc.invoice_id = i.invoice_id
       WHERE dc.doctor_id = ? AND dc.tenant_id = ?
       AND dc.commission_date BETWEEN ? AND ?
       ORDER BY dc.commission_date DESC`,
      [doctorId, tenantId, fromDate, toDate]
    );
    return commissions;
  },

  // Pay Commission
  payCommission: async (commissionId, tenantId, paymentData) => {
    const [result] = await db.query(
      `UPDATE doctor_commissions SET
        payment_status = 'paid',
        payment_date = ?,
        payment_mode = ?,
        notes = ?
      WHERE commission_id = ? AND tenant_id = ?`,
      [
        paymentData.payment_date || new Date(),
        paymentData.payment_mode,
        paymentData.notes,
        commissionId,
        tenantId
      ]
    );
    return result.affectedRows > 0;
  },

  // Get Commission Report
  getCommissionReport: async (doctorId, tenantId, fromDate, toDate) => {
    const [report] = await db.query(
      `SELECT 
        d.doctor_name,
        d.specialization,
        COUNT(dc.commission_id) as total_tests,
        SUM(dc.test_amount) as total_test_amount,
        SUM(dc.commission_amount) as total_commission,
        SUM(CASE WHEN dc.payment_status = 'paid' THEN dc.commission_amount ELSE 0 END) as paid_commission,
        SUM(CASE WHEN dc.payment_status = 'pending' THEN dc.commission_amount ELSE 0 END) as pending_commission
      FROM referring_doctors d
      LEFT JOIN doctor_commissions dc ON d.doctor_id = dc.doctor_id
      WHERE d.doctor_id = ? AND d.tenant_id = ?
      AND (dc.commission_date BETWEEN ? AND ? OR dc.commission_date IS NULL)
      GROUP BY d.doctor_id`,
      [doctorId, tenantId, fromDate, toDate]
    );

    if (report.length === 0) return null;

    // Get detailed commissions
    const commissions = await this.getDoctorCommissions(doctorId, tenantId, fromDate, toDate);
    
    return {
      ...report[0],
      commissions
    };
  },

  // Get Doctor Statistics
  getDoctorStats: async (tenantId) => {
    const [stats] = await db.query(
      `SELECT 
        COUNT(*) as total_doctors,
        SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active_doctors,
        SUM(CASE WHEN commission_type != 'none' THEN 1 ELSE 0 END) as doctors_with_commission
      FROM referring_doctors
      WHERE tenant_id = ?`,
      [tenantId]
    );
    return stats[0];
  }
};

module.exports = DoctorModel;
