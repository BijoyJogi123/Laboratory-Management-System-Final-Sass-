const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Login
router.post('/login-user', authController.login);

module.exports = router;
