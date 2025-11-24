// db.js - Updated for mysql2/promise
const mysql = require('mysql2/promise');
require('dotenv').config();

// Create connection pool (better for multiple queries)
const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Cyberdumb#123',
  database: process.env.DB_NAME || 'laboratory',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test connection on startup
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Connected to MySQL database successfully');
    connection.release();
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
    console.error('🔧 Please check your database configuration:');
    console.error('   - Host:', process.env.DB_HOST);
    console.error('   - User:', process.env.DB_USER);
    console.error('   - Database:', process.env.DB_NAME);
    console.error('   - password:', process.env.DB_PASSWORD);


    console.error('⚠️  Server will continue but database features will not work');
  }
})();

// Export pool for promise-based queries
module.exports = pool;