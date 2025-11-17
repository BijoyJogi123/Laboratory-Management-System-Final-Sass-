const db = require('../config/db.config');

const TemplateModel = {
  // Create Template
  createTemplate: async (templateData) => {
    const [result] = await db.query(
      `INSERT INTO report_templates (
        tenant_id, template_name, template_code, category,
        template_json, is_default, is_active, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        templateData.tenant_id,
        templateData.template_name,
        templateData.template_code,
        templateData.category,
        JSON.stringify(templateData.template_json),
        templateData.is_default || false,
        templateData.is_active !== false,
        templateData.created_by
      ]
    );
    return { templateId: result.insertId, success: true };
  },

  // Get All Templates
  getAllTemplates: async (tenantId, filters = {}) => {
    let query = `SELECT * FROM report_templates WHERE tenant_id = ?`;
    const params = [tenantId];

    if (filters.category) {
      query += ` AND category = ?`;
      params.push(filters.category);
    }

    if (filters.is_active !== undefined) {
      query += ` AND is_active = ?`;
      params.push(filters.is_active);
    }

    query += ` ORDER BY template_name`;

    const [templates] = await db.query(query, params);
    
    // Parse JSON
    templates.forEach(template => {
      template.template_json = JSON.parse(template.template_json);
    });

    return templates;
  },

  // Get Template by ID
  getTemplateById: async (templateId, tenantId) => {
    const [templates] = await db.query(
      `SELECT * FROM report_templates WHERE template_id = ? AND tenant_id = ?`,
      [templateId, tenantId]
    );

    if (templates.length === 0) return null;

    const template = templates[0];
    template.template_json = JSON.parse(template.template_json);
    return template;
  },

  // Update Template
  updateTemplate: async (templateId, tenantId, updateData) => {
    const [result] = await db.query(
      `UPDATE report_templates SET
        template_name = ?,
        template_code = ?,
        category = ?,
        template_json = ?,
        is_default = ?,
        is_active = ?,
        version = version + 1,
        updated_at = CURRENT_TIMESTAMP
      WHERE template_id = ? AND tenant_id = ?`,
      [
        updateData.template_name,
        updateData.template_code,
        updateData.category,
        JSON.stringify(updateData.template_json),
        updateData.is_default,
        updateData.is_active,
        templateId,
        tenantId
      ]
    );
    return result.affectedRows > 0;
  },

  // Delete Template
  deleteTemplate: async (templateId, tenantId) => {
    const [result] = await db.query(
      `DELETE FROM report_templates WHERE template_id = ? AND tenant_id = ?`,
      [templateId, tenantId]
    );
    return result.affectedRows > 0;
  },

  // Upload Asset
  uploadAsset: async (assetData) => {
    const [result] = await db.query(
      `INSERT INTO template_assets (
        tenant_id, asset_type, asset_name, file_path, file_size, mime_type, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        assetData.tenant_id,
        assetData.asset_type,
        assetData.asset_name,
        assetData.file_path,
        assetData.file_size,
        assetData.mime_type,
        true
      ]
    );
    return { assetId: result.insertId, success: true };
  },

  // Get Assets
  getAssets: async (tenantId, assetType = null) => {
    let query = `SELECT * FROM template_assets WHERE tenant_id = ? AND is_active = 1`;
    const params = [tenantId];

    if (assetType) {
      query += ` AND asset_type = ?`;
      params.push(assetType);
    }

    query += ` ORDER BY created_at DESC`;

    const [assets] = await db.query(query, params);
    return assets;
  },

  // Save Template Version
  saveTemplateVersion: async (templateId, templateJson, changesDescription, createdBy) => {
    const [result] = await db.query(
      `INSERT INTO template_versions (
        template_id, version_number, template_json, changes_description, created_by
      ) VALUES (?, (SELECT version FROM report_templates WHERE template_id = ?), ?, ?, ?)`,
      [templateId, templateId, JSON.stringify(templateJson), changesDescription, createdBy]
    );
    return { versionId: result.insertId, success: true };
  },

  // Get Template Versions
  getTemplateVersions: async (templateId) => {
    const [versions] = await db.query(
      `SELECT * FROM template_versions WHERE template_id = ? ORDER BY version_number DESC`,
      [templateId]
    );
    
    versions.forEach(version => {
      version.template_json = JSON.parse(version.template_json);
    });

    return versions;
  }
};

module.exports = TemplateModel;
