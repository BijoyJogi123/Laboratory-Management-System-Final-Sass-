// routes/patientRoutes.js
const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Apply authentication middleware to all routes
router.use(verifyToken);

// Create a new patient with selected tests
router.post('/add-patients', patientController.addPatient);

// Get all patients
router.get('/all-patients', patientController.getAllPatients);

// Get all patients tests
router.get('/all-patients-tests', patientController.getAllPatientsTests);

// Get a patient by ID with selected tests
router.get('/patient/:id', patientController.getPatientTestById);

// Get a patient by ID 
router.get('/specific-patient/:id', patientController.getPatientById)

// Update patient by ID
router.put('/patient/:id', patientController.updatePatient);

//update patient sales data by id
//This is for gett all test from lab_test_master
router.put('/patient/sales/:id', patientController.updateLabSalesItem);


// Delete patient by ID
router.delete('/patient/:id', patientController.deletePatient);

module.exports = router;
