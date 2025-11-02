// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Route to add a new user (public - for registration)
router.post('/users', userController.addUser);

// Apply authentication middleware to protected routes
router.use(verifyToken);

// Route to get all users (protected)
router.get('/users', userController.getUsers);

module.exports = router;
