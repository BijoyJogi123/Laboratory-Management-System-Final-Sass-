const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'backend', '.env') });

async function createTestsTable() {
  let connection;
  
  try {
    console.log('🔗 Connecting to database...');
    
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || '127.0.0.1',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'laboratory'
    });
    
    console.log('✅ Connected to database\n');
    
    // Create tests table
    console.log('📝 Creating tests table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS tests (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        test_name VARCHAR(255) NOT NULL,
        test_code VARCHAR(50),
        category VARCHAR(100),
        price DECIMAL(10,2),
        tat_hours INT DEFAULT 24,
        sample_type VARCHAR(100),
        description TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_test_code (test_code),
        INDEX idx_category (category)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    console.log('✅ Tests table created/verified\n');
    
    // Check if table exists and show structure
    const [tables] = await connection.query("SHOW TABLES LIKE 'tests'");
    if (tables.length > 0) {
      console.log('✅ Tests table exists');
      
      // Show table structure
      const [columns] = await connection.query('DESCRIBE tests');
      console.log('\n📋 Table Structure:');
      columns.forEach(col => {
        console.log(`   - ${col.Field}: ${col.Type}`);
      });
      
      // Check test count
      const [count] = await connection.query('SELECT COUNT(*) as total FROM tests');
      console.log(`\n📊 Total tests: ${count[0].total}`);
    }
    
    console.log('\n✅ Setup complete!');
    console.log('=================================');
    console.log('You can now:');
    console.log('1. Restart backend if running');
    console.log('2. Add tests from the frontend');
    console.log('=================================\n');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

createTestsTable();
