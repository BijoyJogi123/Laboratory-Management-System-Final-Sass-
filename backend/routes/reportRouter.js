const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Apply authentication middleware to all routes
router.use(verifyToken);

// POST route to submit test reports
router.post('/submit', reportController.submitReport);

// GET route to fetch report by sales_item_id
router.get('/report/:sales_item_id', reportController.getReportBySalesItemId);

//This is for gett all test from lab_test_master
router.post('/tests/fetch', reportController.fetchTestsByIds);






module.exports = router;
