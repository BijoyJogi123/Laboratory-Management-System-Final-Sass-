const mysql = require('mysql2/promise');
require('dotenv').config();

const setupLabSettingsTable = async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Cyberdumb#123',
    database: process.env.DB_NAME || 'laboratory'
  });

  try {
    console.log('Creating lab_settings table...');

    // Create lab_settings table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS lab_settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        setting_key VARCHAR(100) NOT NULL UNIQUE,
        setting_value TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_setting_key (setting_key)
      )
    `);

    console.log('✅ lab_settings table created successfully');

    // Insert default lab settings
    const defaultSettings = [
      ['lab_name', 'LabHub Medical Laboratory'],
      ['address', '123 Medical Street, Healthcare City'],
      ['phone', '+91-1234567890'],
      ['email', 'info@labhub.com'],
      ['website', 'www.labhub.com'],
      ['license_number', 'LAB-2024-001']
    ];

    for (const [key, value] of defaultSettings) {
      await connection.execute(`
        INSERT IGNORE INTO lab_settings (setting_key, setting_value) 
        VALUES (?, ?)
      `, [key, value]);
    }

    console.log('✅ Default lab settings inserted');

    // Create uploads directory
    const fs = require('fs');
    const uploadsDir = './uploads/logos';
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
      console.log('✅ Uploads directory created');
    }

    console.log('🎉 Lab settings setup complete!');

  } catch (error) {
    console.error('❌ Error setting up lab settings:', error);
  } finally {
    await connection.end();
  }
};

setupLabSettingsTable();