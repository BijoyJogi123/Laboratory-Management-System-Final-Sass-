const bcrypt = require('bcryptjs');
const mysql = require('mysql2');
require('dotenv').config({ path: './backend/.env' });

console.log('=================================');
console.log('🔧 FIXING LOGIN CREDENTIALS');
console.log('=================================\n');

const connection = mysql.createConnection({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'laboratory'
});

connection.connect(async (err) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  }
  
  console.log('✅ Connected to database\n');
  
  try {
    // Create users table if not exists
    await new Promise((resolve, reject) => {
      connection.query(`
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    
    console.log('✅ Users table ready\n');
    
    // Generate hash for Test@123
    const hashedPassword = await bcrypt.hash('Test@123', 10);
    console.log('✅ Password hashed\n');
    
    // Check if user exists
    const checkUser = await new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM users WHERE email = ?',
        ['test@lab.com'],
        (err, results) => {
          if (err) reject(err);
          else resolve(results);
        }
      );
    });
    
    if (checkUser.length > 0) {
      // Update existing user
      await new Promise((resolve, reject) => {
        connection.query(
          'UPDATE users SET password = ?, name = ? WHERE email = ?',
          [hashedPassword, 'Test User', 'test@lab.com'],
          (err) => {
            if (err) reject(err);
            else resolve();
          }
        );
      });
      console.log('✅ Updated existing user\n');
    } else {
      // Insert new user
      await new Promise((resolve, reject) => {
        connection.query(
          'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
          ['Test User', 'test@lab.com', hashedPassword],
          (err) => {
            if (err) reject(err);
            else resolve();
          }
        );
      });
      console.log('✅ Created new user\n');
    }
    
    // Verify the user
    const verifyUser = await new Promise((resolve, reject) => {
      connection.query(
        'SELECT id, name, email FROM users WHERE email = ?',
        ['test@lab.com'],
        (err, results) => {
          if (err) reject(err);
          else resolve(results);
        }
      );
    });
    
    console.log('=================================');
    console.log('✅ LOGIN CREDENTIALS READY');
    console.log('=================================');
    console.log('Email: test@lab.com');
    console.log('Password: Test@123');
    console.log('User ID:', verifyUser[0].id);
    console.log('Name:', verifyUser[0].name);
    console.log('=================================\n');
    
    connection.end();
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    connection.end();
    process.exit(1);
  }
});
