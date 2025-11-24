const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const { verifyToken } = require('../middleware/auth');

// Get all patients
router.get('/all-patients', verifyToken, patientController.getAllPatients);

// Add patient
router.post('/', verifyToken, patientController.addPatient);

// Update patient
router.put('/:id', verifyToken, patientController.updatePatient);

// Delete patient
router.delete('/:id', verifyToken, patientController.deletePatient);

module.exports = router;
