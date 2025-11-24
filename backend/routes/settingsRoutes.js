const express = require('express');
const router = express.Router();
const SettingsController = require('../controllers/settingsController');
const { verifyToken } = require('../middlewares/authMiddleware');

// All routes require authentication
router.use(verifyToken);

// Invoice settings routes
router.get('/invoice', SettingsController.getInvoiceSettings);
router.put('/invoice', SettingsController.updateInvoiceSettings);

module.exports = router;
