const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

console.log('🔍 Testing Database Connection...');
console.log('================================');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '***' + process.env.DB_PASSWORD.slice(-3) : 'NOT SET');
console.log('================================\n');

async function testConnection() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || '127.0.0.1',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'laboratory'
    });
    
    console.log('✅ Database connection successful!');
    
    // Test a simple query
    const [rows] = await connection.query('SELECT 1 as test');
    console.log('✅ Query test successful:', rows);
    
    // Check tables
    const [tables] = await connection.query('SHOW TABLES');
    console.log('✅ Database tables:', tables.length);
    
    await connection.end();
    console.log('\n✅ All tests passed!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Database connection failed!');
    console.error('Error:', error.message);
    console.error('\n🔧 Please verify:');
    console.error('1. MySQL is running');
    console.error('2. Database "laboratory" exists');
    console.error('3. User has correct permissions');
    console.error('4. Password is correct in .env file');
    process.exit(1);
  }
}

testConnection();
