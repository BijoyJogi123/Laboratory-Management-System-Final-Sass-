// db.js
const mysql = require('mysql2');
const dotenv = require('dotenv');

require('dotenv').config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME


  // host: "127.0.0.1",
  // user: "root",
  // password: "Cyberdumb#123",
  // database: "laboratory"


});

connection.connect((err) => {
  if (err) {
    console.error('❌ Database connection failed:', err.stack);
    console.error('🔧 Please check your database configuration:');
    console.error('   - Host:', process.env.DB_HOST);
    console.error('   - User:', process.env.DB_USER);
    console.error('   - Database:', process.env.DB_NAME);
    return;
  }
  console.log('✅ Connected to MySQL database successfully');
});

module.exports = connection;