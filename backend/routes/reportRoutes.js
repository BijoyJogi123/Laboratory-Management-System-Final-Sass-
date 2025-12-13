const express = require('express');
const router = express.Router();
const ReportController = require('../controllers/reportController');
const { verifyToken } = require('../middlewares/authMiddleware');

// All routes require authentication
router.use(verifyToken);

// Report routes
router.post('/', ReportController.createReport);
router.get('/', ReportController.getAllReports);
router.get('/stats', ReportController.getReportStats);
router.get('/:id', ReportController.getReportById);
router.put('/:id/status', ReportController.updateReportStatus);
router.delete('/:id', ReportController.deleteReport);

// Test results routes
router.put('/:reportId/tests/:testId/results', ReportController.addTestResults);

// Patient reports
router.get('/patient/:patientId', ReportController.getPatientReports);

// PDF generation
router.get('/:id/pdf', ReportController.generateReportPDF);

module.exports = router;