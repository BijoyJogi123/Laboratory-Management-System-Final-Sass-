const express = require('express');
const router = express.Router();
const PatientPortalController = require('../controllers/patientPortalController');

// Middleware for patient portal authentication
const verifyPatientToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.startsWith('Bearer ') 
    ? authHeader.slice(7) 
    : authHeader;

  try {
    const jwt = require('jsonwebtoken');
    const JWT_SECRET = process.env.JWT_SECRET || 'Boom#123';
    const decoded = jwt.verify(token, JWT_SECRET);
    
    if (decoded.type !== 'patient') {
      return res.status(403).json({ message: 'Invalid token type' });
    }
    
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Public routes (no authentication)
router.post('/register', PatientPortalController.register);
router.post('/login', PatientPortalController.login);

// Protected routes (require patient authentication)
router.get('/dashboard', verifyPatientToken, PatientPortalController.getDashboard);
router.get('/bills', verifyPatientToken, PatientPortalController.getBills);
router.get('/emi', verifyPatientToken, PatientPortalController.getEMI);
router.get('/reports', verifyPatientToken, PatientPortalController.getReports);
router.post('/book-test', verifyPatientToken, PatientPortalController.bookTest);
router.put('/profile', verifyPatientToken, PatientPortalController.updateProfile);
router.post('/change-password', verifyPatientToken, PatientPortalController.changePassword);

module.exports = router;
