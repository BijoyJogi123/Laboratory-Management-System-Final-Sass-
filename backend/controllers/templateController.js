const TemplateModel = require('../models/templateModel');

const TemplateController = {
  // Create Template
  createTemplate: async (req, res) => {
    try {
      const tenantId = req.user.tenant_id || 1;
      const templateData = {
        ...req.body,
        tenant_id: tenantId,
        created_by: req.user.userId
      };

      const result = await TemplateModel.createTemplate(templateData);
      
      res.status(201).json({
        success: true,
        message: 'Template created successfully',
        data: result
      });
    } catch (error) {
      console.error('Create template error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create template',
        error: error.message
      });
    }
  },

  // Get All Templates
  getAllTemplates: async (req, res) => {
    try {
      const tenantId = req.user.tenant_id || 1;
      const filters = {
        category: req.query.category,
        is_active: req.query.is_active
      };

      const templates = await TemplateModel.getAllTemplates(tenantId, filters);
      
      res.json({
        success: true,
        data: templates
      });
    } catch (error) {
      console.error('Get templates error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch templates',
        error: error.message
      });
    }
  },

  // Get Template by ID
  getTemplateById: async (req, res) => {
    try {
      const tenantId = req.user.tenant_id || 1;
      const { id } = req.params;

      const template = await TemplateModel.getTemplateById(id, tenantId);
      
      if (!template) {
        return res.status(404).json({
          success: false,
          message: 'Template not found'
        });
      }

      res.json({
        success: true,
        data: template
      });
    } catch (error) {
      console.error('Get template error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch template',
        error: error.message
      });
    }
  },

  // Update Template
  updateTemplate: async (req, res) => {
    try {
      const tenantId = req.user.tenant_id || 1;
      const { id } = req.params;

      // Save version before updating
      const currentTemplate = await TemplateModel.getTemplateById(id, tenantId);
      if (currentTemplate) {
        await TemplateModel.saveTemplateVersion(
          id,
          currentTemplate.template_json,
          req.body.changes_description || 'Updated template',
          req.user.userId
        );
      }

      const success = await TemplateModel.updateTemplate(id, tenantId, req.body);
      
      if (!success) {
        return res.status(404).json({
          success: false,
          message: 'Template not found'
        });
      }

      res.json({
        success: true,
        message: 'Template updated successfully'
      });
    } catch (error) {
      console.error('Update template error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update template',
        error: error.message
      });
    }
  },

  // Delete Template
  deleteTemplate: async (req, res) => {
    try {
      const tenantId = req.user.tenant_id || 1;
      const { id } = req.params;

      const success = await TemplateModel.deleteTemplate(id, tenantId);
      
      if (!success) {
        return res.status(404).json({
          success: false,
          message: 'Template not found'
        });
      }

      res.json({
        success: true,
        message: 'Template deleted successfully'
      });
    } catch (error) {
      console.error('Delete template error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete template',
        error: error.message
      });
    }
  },

  // Upload Asset
  uploadAsset: async (req, res) => {
    try {
      const tenantId = req.user.tenant_id || 1;
      
      // In a real implementation, you'd handle file upload here
      // For now, we'll just accept the file path
      const assetData = {
        ...req.body,
        tenant_id: tenantId
      };

      const result = await TemplateModel.uploadAsset(assetData);
      
      res.status(201).json({
        success: true,
        message: 'Asset uploaded successfully',
        data: result
      });
    } catch (error) {
      console.error('Upload asset error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to upload asset',
        error: error.message
      });
    }
  },

  // Get Assets
  getAssets: async (req, res) => {
    try {
      const tenantId = req.user.tenant_id || 1;
      const assetType = req.query.asset_type;

      const assets = await TemplateModel.getAssets(tenantId, assetType);
      
      res.json({
        success: true,
        data: assets
      });
    } catch (error) {
      console.error('Get assets error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch assets',
        error: error.message
      });
    }
  },

  // Get Template Versions
  getTemplateVersions: async (req, res) => {
    try {
      const { id } = req.params;

      const versions = await TemplateModel.getTemplateVersions(id);
      
      res.json({
        success: true,
        data: versions
      });
    } catch (error) {
      console.error('Get template versions error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch template versions',
        error: error.message
      });
    }
  }
};

module.exports = TemplateController;
