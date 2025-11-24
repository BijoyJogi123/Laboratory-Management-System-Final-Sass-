const express = require('express');
const router = express.Router();
const EMIController = require('../controllers/emiController');
const { verifyToken } = require('../middleware/auth');

// All routes require authentication
router.use(verifyToken);

// EMI Plan routes
router.post('/plans', EMIController.createEMIPlan);
router.get('/plans', EMIController.getAllEMIPlans);
router.get('/plans/:id', EMIController.getEMIPlanById);
router.put('/plans/:id', EMIController.updateEMIPlan);
router.delete('/plans/:id', EMIController.deleteEMIPlan);

// Installment routes
router.get('/installments/due', EMIController.getDueInstallments);
router.get('/installments/overdue', EMIController.getOverdueInstallments);
router.get('/installments/:id', EMIController.getInstallmentById);
router.post('/installments/:id/pay', EMIController.payInstallment);

// Statistics
router.get('/stats', EMIController.getEMIStats);

module.exports = router;
