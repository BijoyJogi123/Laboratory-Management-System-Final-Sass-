const ReportModel = require('../models/reportModel');

const ReportController = {
  // Create Report
  createReport: async (req, res) => {
    try {
      const tenantId = req.user.tenant_id || 1;
      const reportData = {
        ...req.body,
        tenant_id: tenantId
      };

      console.log('Creating report:', reportData);

      const result = await ReportModel.createReport(reportData);
      
      res.status(201).json({
        success: true,
        message: 'Report generated successfully',
        data: result
      });
    } catch (error) {
      console.error('Create report error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate report',
        error: error.message
      });
    }
  },

  // Get All Reports
  getAllReports: async (req, res) => {
    try {
      const tenantId = req.user.tenant_id || 1;
      const filters = {
        status: req.query.status,
        patient_id: req.query.patient_id,
        doctor_id: req.query.doctor_id,
        from_date: req.query.from_date,
        to_date: req.query.to_date
      };

      const reports = await ReportModel.getAllReports(tenantId, filters);
      
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

  // Get Report by ID
  getReportById: async (req, res) => {
    try {
      const tenantId = req.user.tenant_id || 1;
      const { id } = req.params;

      const report = await ReportModel.getReportById(id, tenantId);
      
      if (!report) {
        return res.status(404).json({
          success: false,
          message: 'Report not found'
        });
      }

      res.json({
        success: true,
        data: report
      });
    } catch (error) {
      console.error('Get report error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch report',
        error: error.message
      });
    }
  },

  // Update Report Status
  updateReportStatus: async (req, res) => {
    try {
      const tenantId = req.user.tenant_id || 1;
      const { id } = req.params;
      const { status, doctor_comments } = req.body;
      const verifiedBy = req.user.user_id;

      console.log('Updating report status:', { id, status, doctor_comments, verifiedBy });

      const success = await ReportModel.updateReportStatus(id, tenantId, status, verifiedBy, doctor_comments);
      
      if (!success) {
        return res.status(404).json({
          success: false,
          message: 'Report not found'
        });
      }

      res.json({
        success: true,
        message: 'Report status updated successfully'
      });
    } catch (error) {
      console.error('Update report status error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update report status',
        error: error.message
      });
    }
  },

  // Add Test Results
  addTestResults: async (req, res) => {
    try {
      const { reportId, testId } = req.params;
      const results = req.body;
      const technicianId = req.user.user_id || 1; // Get from authenticated user

      console.log('Adding test results:', { reportId, testId, results, technicianId });

      const success = await ReportModel.addTestResults(reportId, testId, results, technicianId);
      
      if (!success) {
        return res.status(404).json({
          success: false,
          message: 'Report or test not found'
        });
      }

      res.json({
        success: true,
        message: 'Test results added successfully'
      });
    } catch (error) {
      console.error('Add test results error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to add test results',
        error: error.message
      });
    }
  },

  // Get Report Statistics
  getReportStats: async (req, res) => {
    try {
      const tenantId = req.user.tenant_id || 1;

      const stats = await ReportModel.getReportStats(tenantId);
      
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Get report stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch report statistics',
        error: error.message
      });
    }
  },

  // Delete Report
  deleteReport: async (req, res) => {
    try {
      const tenantId = req.user.tenant_id || 1;
      const { id } = req.params;

      const success = await ReportModel.deleteReport(id, tenantId);
      
      if (!success) {
        return res.status(404).json({
          success: false,
          message: 'Report not found'
        });
      }

      res.json({
        success: true,
        message: 'Report deleted successfully'
      });
    } catch (error) {
      console.error('Delete report error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete report',
        error: error.message
      });
    }
  },

  // Get Patient Reports
  getPatientReports: async (req, res) => {
    try {
      const tenantId = req.user.tenant_id || 1;
      const { patientId } = req.params;

      const reports = await ReportModel.getPatientReports(patientId, tenantId);
      
      res.json({
        success: true,
        data: reports
      });
    } catch (error) {
      console.error('Get patient reports error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch patient reports',
        error: error.message
      });
    }
  },

  // Generate Report PDF
  generateReportPDF: async (req, res) => {
    try {
      const tenantId = req.user.tenant_id || 1;
      const { id } = req.params;

      const report = await ReportModel.getReportById(id, tenantId);
      
      if (!report) {
        return res.status(404).json({
          success: false,
          message: 'Report not found'
        });
      }

      // Here you would integrate with a PDF generation library
      // For now, we'll return the report data for frontend PDF generation
      res.json({
        success: true,
        data: report,
        message: 'Report data ready for PDF generation'
      });
    } catch (error) {
      console.error('Generate PDF error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate PDF',
        error: error.message
      });
    }
  }
};

module.exports = ReportController;