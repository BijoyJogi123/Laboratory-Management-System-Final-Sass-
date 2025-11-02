console.log('🚀 Simple Node.js test starting...');

// Test basic Node.js functionality
console.log('✅ Node.js is working');
console.log('📅 Current time:', new Date().toISOString());

// Test environment variables
require('dotenv').config();
console.log('🔧 Environment variables loaded:');
console.log('   DB_HOST:', process.env.DB_HOST);
console.log('   DB_USER:', process.env.DB_USER);
console.log('   DB_NAME:', process.env.DB_NAME);
console.log('   JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Not set');

// Test MySQL module
try {
  const mysql = require('mysql2');
  console.log('✅ MySQL2 module loaded successfully');
  
  // Create connection (but don't connect yet)
  const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectTimeout: 5000, // 5 second timeout
    acquireTimeout: 5000,
    timeout: 5000
  });
  
  console.log('🔌 Attempting database connection...');
  
  connection.connect((err) => {
    if (err) {
      console.error('❌ Database connection failed:', err.code, err.message);
      if (err.code === 'ECONNREFUSED') {
        console.error('💡 MySQL server is not running or not accessible');
      } else if (err.code === 'ER_ACCESS_DENIED_ERROR') {
        console.error('💡 Invalid database credentials');
      }
      process.exit(1);
    }
    
    console.log('✅ Database connected successfully!');
    
    // Test a simple query
    connection.query('SELECT 1 as test', (err, results) => {
      if (err) {
        console.error('❌ Query failed:', err);
        process.exit(1);
      }
      
      console.log('✅ Database query successful:', results);
      connection.end();
      console.log('🎉 All tests passed! Backend should work.');
      process.exit(0);
    });
  });
  
} catch (error) {
  console.error('❌ Error loading MySQL module:', error);
  process.exit(1);
}