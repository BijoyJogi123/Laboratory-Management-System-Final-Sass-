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
    const { patient_name, phone, email, gender, age, address, referred_by } = req.body;
    
    const newPatient = await patientModel.addPatient({
      patient_name,
      phone,
      email,
      gender,
      age,
      address,
      referred_by
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
    const { patient_name, phone, email, gender, age, address, referred_by } = req.body;
    
    const updated = await patientModel.updatePatient(id, {
      patient_name,
      phone,
      email,
      gender,
      age,
      address,
      referred_by
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

// Get all patients with tests
exports.getAllPatientsTests = async (req, res) => {
  try {
    console.log('📋 Fetching all patients with tests');
    const patients = await patientModel.getAllPatients();
    console.log('✅ Fetched patients with tests:', patients.length);
    res.json(patients);
  } catch (error) {
    console.error('❌ Error fetching patients tests:', error);
    res.status(500).json({ message: 'Error fetching patients tests', error: error.message });
  }
};

// Get patient by ID
exports.getPatientById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('📋 Fetching patient by ID:', id);
    const patient = await patientModel.getPatientById(id);
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    console.log('✅ Fetched patient:', patient.patient_name);
    res.json(patient);
  } catch (error) {
    console.error('❌ Error fetching patient:', error);
    res.status(500).json({ message: 'Error fetching patient', error: error.message });
  }
};

// Get patient with tests by ID
exports.getPatientTestById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('📋 Fetching patient with tests by ID:', id);
    const patient = await patientModel.getPatientById(id);
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    console.log('✅ Fetched patient with tests:', patient.patient_name);
    res.json(patient);
  } catch (error) {
    console.error('❌ Error fetching patient tests:', error);
    res.status(500).json({ message: 'Error fetching patient tests', error: error.message });
  }
};

// Update lab sales item for patient
exports.updateLabSalesItem = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('📋 Updating lab sales item for patient:', id);
    const updated = await patientModel.updatePatient(id, req.body);
    
    if (!updated) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    console.log('✅ Lab sales item updated');
    res.json(updated);
  } catch (error) {
    console.error('❌ Error updating lab sales item:', error);
    res.status(500).json({ message: 'Error updating lab sales item', error: error.message });
  }
};
