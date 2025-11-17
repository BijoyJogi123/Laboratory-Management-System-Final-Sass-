const express = require('express');
const router = express.Router();
const DoctorController = require('../controllers/doctorController');
const { verifyToken } = require('../middlewares/authMiddleware');

// All routes require authentication
router.use(verifyToken);

// Doctor routes
router.post('/', DoctorController.createDoctor);
router.get('/', DoctorController.getAllDoctors);
router.get('/stats', DoctorController.getDoctorStats);
router.get('/:id', DoctorController.getDoctorById);
router.put('/:id', DoctorController.updateDoctor);
router.delete('/:id', DoctorController.deleteDoctor);

// Commission routes
router.get('/:id/commissions', DoctorController.getDoctorCommissions);
router.get('/:id/commission-report', DoctorController.getCommissionReport);
router.post('/commissions/:id/pay', DoctorController.payCommission);

module.exports = router;
