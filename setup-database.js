const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: './backend/.env' });

async function setupDatabase() {
  let connection;
  
  try {
    console.log('🔗 Connecting to database...');
    console.log('Host:', process.env.DB_HOST);
    console.log('User:', process.env.DB_USER);
    console.log('Database:', process.env.DB_NAME);
    console.log('');
    
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || '127.0.0.1',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'laboratory',
      multipleStatements: true
    });
    
    console.log('✅ Connected to database\n');
    
    // Create patients table
    console.log('📝 Creating patients table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS patients (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        patient_name VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        email VARCHAR(255),
        gender ENUM('male', 'female', 'other'),
        age INT,
        address TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_phone (phone),
        INDEX idx_email (email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    console.log('✅ Patients table created\n');
    
    // Verify tables exist
    const [tables] = await connection.query("SHOW TABLES LIKE 'patients'");
    if (tables.length > 0) {
      console.log('✅ Patients table verified');
      
      // Check patient count
      const [count] = await connection.query('SELECT COUNT(*) as total FROM patients');
      console.log(`   Total patients: ${count[0].total}`);
    }
    
    // Check users table
    const [userTables] = await connection.query("SHOW TABLES LIKE 'users'");
    if (userTables.length > 0) {
      const [userCount] = await connection.query('SELECT COUNT(*) as total FROM users');
      console.log(`✅ Users table exists (${userCount[0].total} users)`);
    }
    
    console.log('\n✅ Database setup complete!');
    console.log('=================================');
    console.log('You can now:');
    console.log('1. Start the backend: npm start');
    console.log('2. Login with: test@lab.com / Test@123');
    console.log('3. Create patients and manage data');
    console.log('=================================\n');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\nPlease check:');
    console.error('1. MySQL is running');
    console.error('2. Database "laboratory" exists');
    console.error('3. Credentials in backend/.env are correct');
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

setupDatabase();
