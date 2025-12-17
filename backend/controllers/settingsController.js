const db = require('../config/db.config');
const fs = require('fs');
const path = require('path');

// Upload laboratory logo
const uploadLogo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const logoUrl = `/uploads/logos/${req.file.filename}`;
    
    // Update or insert lab settings with logo URL
    const query = `
      INSERT INTO lab_settings (setting_key, setting_value, updated_at) 
      VALUES ('logo_url', ?, NOW())
      ON DUPLICATE KEY UPDATE 
      setting_value = VALUES(setting_value),
      updated_at = NOW()
    `;
    
    await db.execute(query, [logoUrl]);

    res.json({
      message: 'Logo uploaded successfully',
      logo_url: logoUrl
    });
  } catch (error) {
    console.error('Error uploading logo:', error);
    res.status(500).json({ message: 'Failed to upload logo' });
  }
};

// Remove laboratory logo
const removeLogo = async (req, res) => {
  try {
    // Get current logo URL
    const [rows] = await db.execute(
      'SELECT setting_value FROM lab_settings WHERE setting_key = ?',
      ['logo_url']
    );

    if (rows.length > 0) {
      const logoUrl = rows[0].setting_value;
      const filePath = path.join(__dirname, '..', logoUrl);
      
      // Delete file if it exists
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Remove logo URL from database
    await db.execute(
      'DELETE FROM lab_settings WHERE setting_key = ?',
      ['logo_url']
    );

    res.json({ message: 'Logo removed successfully' });
  } catch (error) {
    console.error('Error removing logo:', error);
    res.status(500).json({ message: 'Failed to remove logo' });
  }
};

// Get laboratory information
const getLabInfo = async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT setting_key, setting_value FROM lab_settings'
    );

    const labInfo = {};
    rows.forEach(row => {
      labInfo[row.setting_key] = row.setting_value;
    });

    // Set default values if not found
    const defaultLabInfo = {
      lab_name: labInfo.lab_name || 'LabHub Medical Laboratory',
      address: labInfo.address || '123 Medical Street, Healthcare City',
      phone: labInfo.phone || '+91-1234567890',
      email: labInfo.email || 'info@labhub.com',
      website: labInfo.website || 'www.labhub.com',
      license_number: labInfo.license_number || 'LAB-2024-001',
      logo_url: labInfo.logo_url || null
    };

    res.json(defaultLabInfo);
  } catch (error) {
    console.error('Error fetching lab info:', error);
    res.status(500).json({ message: 'Failed to fetch laboratory information' });
  }
};

// Update laboratory information
const updateLabInfo = async (req, res) => {
  try {
    const { lab_name, address, phone, email, website, license_number } = req.body;

    const settings = [
      { key: 'lab_name', value: lab_name },
      { key: 'address', value: address },
      { key: 'phone', value: phone },
      { key: 'email', value: email },
      { key: 'website', value: website },
      { key: 'license_number', value: license_number }
    ];

    // Update each setting
    for (const setting of settings) {
      await db.execute(`
        INSERT INTO lab_settings (setting_key, setting_value, updated_at) 
        VALUES (?, ?, NOW())
        ON DUPLICATE KEY UPDATE 
        setting_value = VALUES(setting_value),
        updated_at = NOW()
      `, [setting.key, setting.value]);
    }

    res.json({ message: 'Laboratory information updated successfully' });
  } catch (error) {
    console.error('Error updating lab info:', error);
    res.status(500).json({ message: 'Failed to update laboratory information' });
  }
};

module.exports = {
  uploadLogo,
  removeLogo,
  getLabInfo,
  updateLabInfo
};