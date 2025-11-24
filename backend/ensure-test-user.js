const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function ensureTestUser() {
  let connection;
  
  try {
    console.log('🔗 Connecting to database...');
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || '127.0.0.1',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'laboratory'
    });
    
    console.log('✅ Connected to database');
    
    // Check if users table exists
    const [tables] = await connection.query("SHOW TABLES LIKE 'users'");
    
    if (tables.length === 0) {
      console.log('📝 Creating users table...');
      await connection.query(`
        CREATE TABLE users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('✅ Users table created');
    }
    
    // Check if test user exists
    const [existingUsers] = await connection.query(
      'SELECT * FROM users WHERE email = ?',
      ['test@lab.com']
    );
    
    if (existingUsers.length > 0) {
      console.log('🔄 Test user exists, updating password...');
      const hashedPassword = await bcrypt.hash('Test@123', 10);
      await connection.query(
        'UPDATE users SET password = ?, name = ? WHERE email = ?',
        [hashedPassword, 'Test User', 'test@lab.com']
      );
      console.log('✅ Test user password updated');
    } else {
      console.log('➕ Creating test user...');
      const hashedPassword = await bcrypt.hash('Test@123', 10);
      await connection.query(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        ['Test User', 'test@lab.com', hashedPassword]
      );
      console.log('✅ Test user created');
    }
    
    // Verify the user
    const [users] = await connection.query(
      'SELECT id, name, email FROM users WHERE email = ?',
      ['test@lab.com']
    );
    
    console.log('\n✅ Test user ready:');
    console.log('   Email: test@lab.com');
    console.log('   Password: Test@123');
    console.log('   User ID:', users[0].id);
    console.log('   Name:', users[0].name);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

ensureTestUser();
