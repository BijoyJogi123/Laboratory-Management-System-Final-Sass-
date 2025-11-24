const patientModel = require('../models/patientModel');

// Get all patients
exports.getAllPatients = async (req, res) => {
  try {
    console.log('📋 Fetching all patients for user:', req.user.email);
    const patients = await patientModel.getAllPatients();
    console.log('✅ Fetched patients from database:', patients.length);
    res.json(patients);
  } catch (error) {
    console.error('❌ Error fetching patients:', error);
    res.status(500).json({ message: 'Error fetching patients', error: error.message });
  }
};

// Add patient
exports.addPatient = async (req, res) => {
  try {
    console.log('➕ Adding new patient:', req.body);
    const { patient_name, phone, email, gender, age, address } = req.body;
    
    const newPatient = await patientModel.addPatient({
      patient_name,
      phone,
      email,
      gender,
      age,
      address
    });
    
    console.log('✅ Patient created in database:', patient_name);
    res.json(newPatient);
  } catch (error) {
    console.error('❌ Error creating patient:', error);
    res.status(500).json({ message: 'Error creating patient', error: error.message });
  }
};

// Update patient
exports.updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const { patient_name, phone, email, gender, age, address } = req.body;
    
    const updated = await patientModel.updatePatient(id, {
      patient_name,
      phone,
      email,
      gender,
      age,
      address
    });
    
    if (!updated) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    console.log('✅ Patient updated in database:', patient_name);
    res.json(updated);
  } catch (error) {
    console.error('❌ Error updating patient:', error);
    res.status(500).json({ message: 'Error updating patient', error: error.message });
  }
};

// Delete patient
exports.deletePatient = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deleted = await patientModel.deletePatient(id);
    
    if (!deleted) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    console.log('✅ Patient deleted from database');
    res.json({ message: 'Patient deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting patient:', error);
    res.status(500).json({ message: 'Error deleting patient', error: error.message });
  }
};
