const PatientPortalModel = require('../models/patientPortalModel');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'Boom#123';

const PatientPortalController = {
  // Register
  register: async (req, res) => {
    try {
      const tenantId = req.body.tenant_id || 1;
      const registrationData = {
        ...req.body,
        tenant_id: tenantId
      };

      const result = await PatientPortalModel.registerPatient(registrationData);
      
      res.status(201).json({
        success: true,
        message: 'Registration successful',
        data: result
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        message: 'Registration failed',
        error: error.message
      });
    }
  },

  // Login
  login: async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: 'Username and password are required'
        });
      }

      const user = await PatientPortalModel.loginPatient(username, password);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid username or password'
        });
      }

      // Generate token
      const token = jwt.sign(
        {
          portalUserId: user.portal_user_id,
          patientId: user.patient_id,
          tenantId: user.tenant_id,
          type: 'patient'
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        success: true,
        message: 'Login successful',
        token,
        user: {
          portal_user_id: user.portal_user_id,
          patient_id: user.patient_id,
          username: user.username,
          email: user.email
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Login failed',
        error: error.message
      });
    }
  },

  // Get Dashboard
  getDashboard: async (req, res) => {
    try {
      const patientId = req.user.patientId;
      const tenantId = req.user.tenantId;

      const dashboard = await PatientPortalModel.getPatientDashboard(patientId, tenantId);

      if (!dashboard) {
        return res.status(404).json({
          success: false,
          message: 'Patient not found'
        });
      }

      res.json({
        success: true,
        data: dashboard
      });
    } catch (error) {
      console.error('Get dashboard error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch dashboard',
        error: error.message
      });
    }
  },

  // Get Bills
  getBills: async (req, res) => {
    try {
      const patientId = req.user.patientId;
      const tenantId = req.user.tenantId;

      const bills = await PatientPortalModel.getPatientBills(patientId, tenantId);

      res.json({
        success: true,
        data: bills
      });
    } catch (error) {
      console.error('Get bills error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch bills',
        error: error.message
      });
    }
  },

  // Get EMI
  getEMI: async (req, res) => {
    try {
      const patientId = req.user.patientId;
      const tenantId = req.user.tenantId;

      const emiPlans = await PatientPortalModel.getPatientEMI(patientId, tenantId);

      res.json({
        success: true,
        data: emiPlans
      });
    } catch (error) {
      console.error('Get EMI error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch EMI details',
        error: error.message
      });
    }
  },

  // Get Reports
  getReports: async (req, res) => {
    try {
      const patientId = req.user.patientId;
      const tenantId = req.user.tenantId;

      const reports = await PatientPortalModel.getPatientReports(patientId, tenantId);

      res.json({
        success: true,
        data: reports
      });
    } catch (error) {
      console.error('Get reports error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch reports',
        error: error.message
      });
    }
  },

  // Book Test
  bookTest: async (req, res) => {
    try {
      const patientId = req.user.patientId;
      const tenantId = req.user.tenantId;
      
      const bookingData = {
        ...req.body,
        patient_id: patientId,
        tenant_id: tenantId
      };

      const result = await PatientPortalModel.bookTest(bookingData);

      res.status(201).json({
        success: true,
        message: 'Test booked successfully',
        data: result
      });
    } catch (error) {
      console.error('Book test error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to book test',
        error: error.message
      });
    }
  },

  // Update Profile
  updateProfile: async (req, res) => {
    try {
      const patientId = req.user.patientId;
      const tenantId = req.user.tenantId;

      const success = await PatientPortalModel.updatePatientProfile(patientId, tenantId, req.body);

      if (!success) {
        return res.status(404).json({
          success: false,
          message: 'Patient not found'
        });
      }

      res.json({
        success: true,
        message: 'Profile updated successfully'
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update profile',
        error: error.message
      });
    }
  },

  // Change Password
  changePassword: async (req, res) => {
    try {
      const portalUserId = req.user.portalUserId;
      const { old_password, new_password } = req.body;

      if (!old_password || !new_password) {
        return res.status(400).json({
          success: false,
          message: 'Old and new passwords are required'
        });
      }

      const result = await PatientPortalModel.changePassword(portalUserId, old_password, new_password);

      if (!result.success) {
        return res.status(400).json(result);
      }

      res.json(result);
    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to change password',
        error: error.message
      });
    }
  }
};

module.exports = PatientPortalController;
