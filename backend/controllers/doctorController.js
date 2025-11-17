const DoctorModel = require('../models/doctorModel');

const DoctorController = {
  // Create Doctor
  createDoctor: async (req, res) => {
    try {
      const tenantId = req.user.tenant_id || 1;
      const doctorData = {
        ...req.body,
        tenant_id: tenantId
      };

      const result = await DoctorModel.createDoctor(doctorData);
      
      res.status(201).json({
        success: true,
        message: 'Doctor created successfully',
        data: result
      });
    } catch (error) {
      console.error('Create doctor error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create doctor',
        error: error.message
      });
    }
  },

  // Get All Doctors
  getAllDoctors: async (req, res) => {
    try {
      const tenantId = req.user.tenant_id || 1;
      const filters = {
        is_active: req.query.is_active,
        specialization: req.query.specialization,
        search: req.query.search
      };

      const doctors = await DoctorModel.getAllDoctors(tenantId, filters);
      
      res.json({
        success: true,
        data: doctors
      });
    } catch (error) {
      console.error('Get doctors error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch doctors',
        error: error.message
      });
    }
  },

  // Get Doctor by ID
  getDoctorById: async (req, res) => {
    try {
      const tenantId = req.user.tenant_id || 1;
      const { id } = req.params;

      const doctor = await DoctorModel.getDoctorById(id, tenantId);
      
      if (!doctor) {
        return res.status(404).json({
          success: false,
          message: 'Doctor not found'
        });
      }

      res.json({
        success: true,
        data: doctor
      });
    } catch (error) {
      console.error('Get doctor error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch doctor',
        error: error.message
      });
    }
  },

  // Update Doctor
  updateDoctor: async (req, res) => {
    try {
      const tenantId = req.user.tenant_id || 1;
      const { id } = req.params;

      const success = await DoctorModel.updateDoctor(id, tenantId, req.body);
      
      if (!success) {
        return res.status(404).json({
          success: false,
          message: 'Doctor not found'
        });
      }

      res.json({
        success: true,
        message: 'Doctor updated successfully'
      });
    } catch (error) {
      console.error('Update doctor error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update doctor',
        error: error.message
      });
    }
  },

  // Delete Doctor
  deleteDoctor: async (req, res) => {
    try {
      const tenantId = req.user.tenant_id || 1;
      const { id } = req.params;

      const success = await DoctorModel.deleteDoctor(id, tenantId);
      
      if (!success) {
        return res.status(404).json({
          success: false,
          message: 'Doctor not found'
        });
      }

      res.json({
        success: true,
        message: 'Doctor deleted successfully'
      });
    } catch (error) {
      console.error('Delete doctor error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete doctor',
        error: error.message
      });
    }
  },

  // Get Doctor Commissions
  getDoctorCommissions: async (req, res) => {
    try {
      const tenantId = req.user.tenant_id || 1;
      const { id } = req.params;
      const fromDate = req.query.from_date || new Date(new Date().getFullYear(), 0, 1);
      const toDate = req.query.to_date || new Date();

      const commissions = await DoctorModel.getDoctorCommissions(id, tenantId, fromDate, toDate);
      
      res.json({
        success: true,
        data: commissions
      });
    } catch (error) {
      console.error('Get commissions error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch commissions',
        error: error.message
      });
    }
  },

  // Pay Commission
  payCommission: async (req, res) => {
    try {
      const tenantId = req.user.tenant_id || 1;
      const { id } = req.params;

      const success = await DoctorModel.payCommission(id, tenantId, req.body);
      
      if (!success) {
        return res.status(404).json({
          success: false,
          message: 'Commission not found'
        });
      }

      res.json({
        success: true,
        message: 'Commission paid successfully'
      });
    } catch (error) {
      console.error('Pay commission error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to pay commission',
        error: error.message
      });
    }
  },

  // Get Commission Report
  getCommissionReport: async (req, res) => {
    try {
      const tenantId = req.user.tenant_id || 1;
      const { id } = req.params;
      const fromDate = req.query.from_date || new Date(new Date().getFullYear(), 0, 1);
      const toDate = req.query.to_date || new Date();

      const report = await DoctorModel.getCommissionReport(id, tenantId, fromDate, toDate);
      
      if (!report) {
        return res.status(404).json({
          success: false,
          message: 'Doctor not found'
        });
      }

      res.json({
        success: true,
        data: report
      });
    } catch (error) {
      console.error('Get commission report error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch commission report',
        error: error.message
      });
    }
  },

  // Get Doctor Statistics
  getDoctorStats: async (req, res) => {
    try {
      const tenantId = req.user.tenant_id || 1;

      const stats = await DoctorModel.getDoctorStats(tenantId);
      
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Get doctor stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch doctor statistics',
        error: error.message
      });
    }
  }
};

module.exports = DoctorController;
