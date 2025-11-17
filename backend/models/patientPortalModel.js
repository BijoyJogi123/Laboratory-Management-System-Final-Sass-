const db = require('../config/db.config');
const bcrypt = require('bcryptjs');

const PatientPortalModel = {
  // Register Patient
  registerPatient: async (registrationData) => {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Hash password
      const passwordHash = await bcrypt.hash(registrationData.password, 10);

      // Create portal user
      const [result] = await connection.query(
        `INSERT INTO patient_portal_users (
          tenant_id, patient_id, username, password_hash, email, phone, is_active
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          registrationData.tenant_id,
          registrationData.patient_id,
          registrationData.username,
          passwordHash,
          registrationData.email,
          registrationData.phone,
          true
        ]
      );

      await connection.commit();
      return { portalUserId: result.insertId, success: true };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  // Login Patient
  loginPatient: async (username, password) => {
    const [users] = await db.query(
      `SELECT * FROM patient_portal_users WHERE username = ? AND is_active = 1`,
      [username]
    );

    if (users.length === 0) {
      return null;
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return null;
    }

    // Update last login
    await db.query(
      `UPDATE patient_portal_users SET last_login = NOW() WHERE portal_user_id = ?`,
      [user.portal_user_id]
    );

    return user;
  },

  // Get Patient Dashboard Data
  getPatientDashboard: async (patientId, tenantId) => {
    // Get patient info
    const [patients] = await db.query(
      `SELECT * FROM patients WHERE id = ? AND tenant_id = ?`,
      [patientId, tenantId]
    );

    if (patients.length === 0) {
      return null;
    }

    // Get recent invoices
    const [invoices] = await db.query(
      `SELECT * FROM invoices 
       WHERE patient_id = ? AND tenant_id = ?
       ORDER BY invoice_date DESC LIMIT 5`,
      [patientId, tenantId]
    );

    // Get EMI plans
    const [emiPlans] = await db.query(
      `SELECT ep.*, i.invoice_number
       FROM emi_plans ep
       JOIN invoices i ON ep.invoice_id = i.invoice_id
       WHERE i.patient_id = ? AND ep.tenant_id = ?
       AND ep.status = 'active'`,
      [patientId, tenantId]
    );

    // Get test orders
    const [testOrders] = await db.query(
      `SELECT to.*, t.test_name
       FROM test_orders to
       LEFT JOIN lab_test_master t ON to.test_id = t.test_id
       WHERE to.patient_id = ? AND to.tenant_id = ?
       ORDER BY to.order_date DESC LIMIT 5`,
      [patientId, tenantId]
    );

    return {
      patient: patients[0],
      recent_invoices: invoices,
      emi_plans: emiPlans,
      recent_orders: testOrders
    };
  },

  // Get Patient Bills
  getPatientBills: async (patientId, tenantId) => {
    const [invoices] = await db.query(
      `SELECT * FROM invoices 
       WHERE patient_id = ? AND tenant_id = ?
       ORDER BY invoice_date DESC`,
      [patientId, tenantId]
    );
    return invoices;
  },

  // Get Patient EMI Details
  getPatientEMI: async (patientId, tenantId) => {
    const [emiPlans] = await db.query(
      `SELECT ep.*, i.invoice_number, i.total_amount as invoice_amount
       FROM emi_plans ep
       JOIN invoices i ON ep.invoice_id = i.invoice_id
       WHERE i.patient_id = ? AND ep.tenant_id = ?
       ORDER BY ep.created_at DESC`,
      [patientId, tenantId]
    );

    // Get installments for each plan
    for (let plan of emiPlans) {
      const [installments] = await db.query(
        `SELECT * FROM emi_installments 
         WHERE emi_plan_id = ?
         ORDER BY installment_number`,
        [plan.emi_plan_id]
      );
      plan.installments = installments;
    }

    return emiPlans;
  },

  // Get Patient Reports
  getPatientReports: async (patientId, tenantId) => {
    const [reports] = await db.query(
      `SELECT lr.*, t.test_name
       FROM lab_report lr
       LEFT JOIN lab_test_master t ON lr.test_id = t.test_id
       WHERE lr.patient_id = ? AND lr.tenant_id = ?
       ORDER BY lr.created_at DESC`,
      [patientId, tenantId]
    );
    return reports;
  },

  // Book Test
  bookTest: async (bookingData) => {
    const [result] = await db.query(
      `INSERT INTO test_orders (
        tenant_id, patient_id, test_id, package_id, order_number,
        order_date, status, priority, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        bookingData.tenant_id,
        bookingData.patient_id,
        bookingData.test_id,
        bookingData.package_id,
        `ORD-${Date.now()}`,
        new Date(),
        'ordered',
        'normal',
        bookingData.notes
      ]
    );
    return { orderId: result.insertId, success: true };
  },

  // Update Patient Profile
  updatePatientProfile: async (patientId, tenantId, updateData) => {
    const [result] = await db.query(
      `UPDATE patients SET
        patient_contact = ?,
        email = ?,
        address = ?
      WHERE id = ? AND tenant_id = ?`,
      [
        updateData.patient_contact,
        updateData.email,
        updateData.address,
        patientId,
        tenantId
      ]
    );
    return result.affectedRows > 0;
  },

  // Change Password
  changePassword: async (portalUserId, oldPassword, newPassword) => {
    const [users] = await db.query(
      `SELECT * FROM patient_portal_users WHERE portal_user_id = ?`,
      [portalUserId]
    );

    if (users.length === 0) {
      return { success: false, message: 'User not found' };
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(oldPassword, user.password_hash);

    if (!isMatch) {
      return { success: false, message: 'Incorrect old password' };
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    await db.query(
      `UPDATE patient_portal_users SET password_hash = ? WHERE portal_user_id = ?`,
      [newPasswordHash, portalUserId]
    );

    return { success: true, message: 'Password changed successfully' };
  }
};

module.exports = PatientPortalModel;
