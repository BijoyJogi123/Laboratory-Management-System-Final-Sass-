const db = require('../config/db.config');

// Get all patients
exports.getAllPatients = async () => {
  const [patients] = await db.query('SELECT * FROM patients ORDER BY created_at DESC');
  return patients;
};

// Add patient
exports.addPatient = async (patientData) => {
  const { patient_name, phone, email, gender, age, address } = patientData;

  const [result] = await db.query(
    'INSERT INTO patients (patient_name, phone, email, gender, age, address) VALUES (?, ?, ?, ?, ?, ?)',
    [patient_name, phone, email, gender, age, address]
  );

  const [newPatient] = await db.query('SELECT * FROM patients WHERE id = ?', [result.insertId]);
  return newPatient[0];
};

// Update patient
exports.updatePatient = async (id, patientData) => {
  const { patient_name, phone, email, gender, age, address } = patientData;

  await db.query(
    'UPDATE patients SET patient_name = ?, phone = ?, email = ?, gender = ?, age = ?, address = ? WHERE id = ?',
    [patient_name, phone, email, gender, age, address, id]
  );

  const [updated] = await db.query('SELECT * FROM patients WHERE id = ?', [id]);
  return updated.length > 0 ? updated[0] : null;
};

// Delete patient
exports.deletePatient = async (id) => {
  const [result] = await db.query('DELETE FROM patients WHERE id = ?', [id]);
  return result.affectedRows > 0;
};
