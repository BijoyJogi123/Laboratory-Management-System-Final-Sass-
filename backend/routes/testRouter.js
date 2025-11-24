// routes/testRoutes.js
const express = require('express');
const router = express.Router();
const testController = require('../controllers/testController');
const { verifyToken } = require('../middlewares/authMiddleware');



// Apply authentication middleware to all routes
router.use(verifyToken);

// Create a new Item
router.post('/create-item', testController.createItem);

// Create a new test
router.post('/create-test', testController.createTest);
router.post('/', testController.createTest); // Alternative route for frontend

// Get all tests
router.get('/all-tests', testController.getAllTests);

// Get all tests
router.get('/all-items', testController.getAllItems);

// Get a test by ID
router.get('/test/:id', testController.getTestById);

// Update a test by ID
router.put('/test/:id', testController.updateTest);

// Update a item by ID
router.put('/item/:id', testController.updateItem);

// Delete a test by ID
router.delete('/test/:id', testController.deleteTest);

// Delete a test by ID
router.delete('/item/:id', testController.deleteItem);

module.exports = router;