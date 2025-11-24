const db = require('../config/db.config');

const SettingsModel = {
  // Get invoice settings for a tenant
  getInvoiceSettings: async (tenantId) => {
    const [settings] = await db.query(
      `SELECT * FROM invoice_settings WHERE tenant_id = ?`,
      [tenantId]
    );
    return settings[0] || null;
  },

  // Create or update invoice settings
  upsertInvoiceSettings: async (tenantId, settingsData) => {
    const {
      lab_name,
      logo_url,
      address,
      phone,
      email,
      website,
      tax_id,
      terms_conditions,
      header_color,
      show_logo,
      invoice_prefix,
      footer_text
    } = settingsData;

    // Check if settings exist
    const existing = await SettingsModel.getInvoiceSettings(tenantId);

    if (existing) {
      // Update existing settings
      await db.query(
        `UPDATE invoice_settings SET
          lab_name = ?,
          logo_url = ?,
          address = ?,
          phone = ?,
          email = ?,
          website = ?,
          tax_id = ?,
          terms_conditions = ?,
          header_color = ?,
          show_logo = ?,
          invoice_prefix = ?,
          footer_text = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE tenant_id = ?`,
        [lab_name, logo_url, address, phone, email, website, tax_id, 
         terms_conditions, header_color, show_logo, invoice_prefix, footer_text, tenantId]
      );
    } else {
      // Insert new settings
      await db.query(
        `INSERT INTO invoice_settings (
          tenant_id, lab_name, logo_url, address, phone, email, website,
          tax_id, terms_conditions, header_color, show_logo, invoice_prefix, footer_text
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [tenantId, lab_name, logo_url, address, phone, email, website,
         tax_id, terms_conditions, header_color, show_logo, invoice_prefix, footer_text]
      );
    }

    return await SettingsModel.getInvoiceSettings(tenantId);
  }
};

module.exports = SettingsModel;
