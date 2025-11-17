const express = require('express');
const router = express.Router();
const EMIController = require('../controllers/emiController');
const { verifyToken } = require('../middlewares/authMiddleware');

// All routes require authentication
router.use(verifyToken);

// EMI Plan routes
router.post('/plans', EMIController.createEMIPlan);
router.get('/plans', EMIController.getAllEMIPlans);
router.get('/plans/:id', EMIController.getEMIPlanById);

// Installment routes
router.get('/installments/due', EMIController.getDueInstallments);
router.get('/installments/overdue', EMIController.getOverdueInstallments);
router.post('/installments/:id/pay', EMIController.payInstallment);

// Statistics
router.get('/stats', EMIController.getEMIStats);

module.exports = router;
