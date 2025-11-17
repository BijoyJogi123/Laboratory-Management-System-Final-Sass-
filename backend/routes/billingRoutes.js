const express = require('express');
const router = express.Router();
const BillingController = require('../controllers/billingController');
const { verifyToken } = require('../middlewares/authMiddleware');

// All routes require authentication
router.use(verifyToken);

// Invoice routes
router.post('/invoices', BillingController.createInvoice);
router.get('/invoices', BillingController.getAllInvoices);
router.get('/invoices/stats', BillingController.getInvoiceStats);
router.get('/invoices/:id', BillingController.getInvoiceById);
router.put('/invoices/:id', BillingController.updateInvoice);
router.delete('/invoices/:id', BillingController.deleteInvoice);
router.post('/invoices/:id/payment', BillingController.recordPayment);

module.exports = router;
