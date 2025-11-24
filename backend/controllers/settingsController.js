const SettingsModel = require('../models/settingsModel');

const SettingsController = {
  // Get invoice settings
  getInvoiceSettings: async (req, res) => {
    try {
      const tenantId = req.user.tenant_id || 1;
      const settings = await SettingsModel.getInvoiceSettings(tenantId);
      
      if (!settings) {
        // Return default settings if none exist
        return res.json({
          success: true,
          data: {
            lab_name: 'Laboratory Management System',
            address: '',
            phone: '',
            email: '',
            website: '',
            tax_id: '',
            terms_conditions: 'Thank you for your business.',
            header_color: '#2563eb',
            show_logo: true,
            invoice_prefix: 'INV',
            footer_text: ''
          }
        });
      }

      res.json({
        success: true,
        data: settings
      });
    } catch (error) {
      console.error('Get invoice settings error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch invoice settings',
        error: error.message
      });
    }
  },

  // Update invoice settings
  updateInvoiceSettings: async (req, res) => {
    try {
      const tenantId = req.user.tenant_id || 1;
      const settingsData = req.body;

      const updatedSettings = await SettingsModel.upsertInvoiceSettings(tenantId, settingsData);

      res.json({
        success: true,
        message: 'Invoice settings updated successfully',
        data: updatedSettings
      });
    } catch (error) {
      console.error('Update invoice settings error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update invoice settings',
        error: error.message
      });
    }
  }
};

module.exports = SettingsController;
