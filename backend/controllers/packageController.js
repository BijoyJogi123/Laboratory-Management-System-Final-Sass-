const PackageModel = require('../models/packageModel');

const PackageController = {
  // Create Package
  createPackage: async (req, res) => {
    try {
      const tenantId = req.user.tenant_id || 1;
      const packageData = {
        ...req.body,
        tenant_id: tenantId
      };

      const result = await PackageModel.createPackage(packageData);
      
      res.status(201).json({
        success: true,
        message: 'Package created successfully',
        data: result
      });
    } catch (error) {
      console.error('Create package error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create package',
        error: error.message
      });
    }
  },

  // Get All Packages
  getAllPackages: async (req, res) => {
    try {
      const tenantId = req.user.tenant_id || 1;
      const filters = {
        is_active: req.query.is_active,
        category: req.query.category,
        search: req.query.search
      };

      const packages = await PackageModel.getAllPackages(tenantId, filters);
      
      res.json({
        success: true,
        data: packages
      });
    } catch (error) {
      console.error('Get packages error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch packages',
        error: error.message
      });
    }
  },

  // Get Package by ID
  getPackageById: async (req, res) => {
    try {
      const tenantId = req.user.tenant_id || 1;
      const { id } = req.params;

      const packageData = await PackageModel.getPackageById(id, tenantId);
      
      if (!packageData) {
        return res.status(404).json({
          success: false,
          message: 'Package not found'
        });
      }

      res.json({
        success: true,
        data: packageData
      });
    } catch (error) {
      console.error('Get package error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch package',
        error: error.message
      });
    }
  },

  // Update Package
  updatePackage: async (req, res) => {
    try {
      const tenantId = req.user.tenant_id || 1;
      const { id } = req.params;

      const result = await PackageModel.updatePackage(id, tenantId, req.body);
      
      res.json({
        success: true,
        message: 'Package updated successfully'
      });
    } catch (error) {
      console.error('Update package error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update package',
        error: error.message
      });
    }
  },

  // Delete Package
  deletePackage: async (req, res) => {
    try {
      const tenantId = req.user.tenant_id || 1;
      const { id } = req.params;

      const success = await PackageModel.deletePackage(id, tenantId);
      
      if (!success) {
        return res.status(404).json({
          success: false,
          message: 'Package not found'
        });
      }

      res.json({
        success: true,
        message: 'Package deleted successfully'
      });
    } catch (error) {
      console.error('Delete package error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete package',
        error: error.message
      });
    }
  },

  // Get Package Statistics
  getPackageStats: async (req, res) => {
    try {
      const tenantId = req.user.tenant_id || 1;

      const stats = await PackageModel.getPackageStats(tenantId);
      
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Get package stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch package statistics',
        error: error.message
      });
    }
  }
};

module.exports = PackageController;
