// Test database connection
require('dotenv').config();
const mysql = require('mysql2');

console.log('Testing database connection...');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_NAME:', process.env.DB_NAME);

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

connection.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }
  
  console.log('✅ Connected to database successfully!');
  
  // Check if users table exists
  connection.query('SHOW TABLES LIKE "users"', (err, results) => {
    if (err) {
      console.error('Error checking tables:', err);
      process.exit(1);
    }
    
    if (results.length > 0) {
      console.log('✅ Users table exists');
      
      // Check existing users
      connection.query('SELECT id, name, email FROM users', (err, users) => {
        if (err) {
          console.error('Error fetching users:', err);
          process.exit(1);
        }
        
        console.log('📋 Existing users:');
        if (users.length === 0) {
          console.log('   No users found');
        } else {
          users.forEach(user => {
            console.log(`   ID: ${user.id}, Name: ${user.name}, Email: ${user.email}`);
          });
        }
        
        connection.end();
        process.exit(0);
      });
    } else {
      console.log('❌ Users table does not exist');
      connection.end();
      process.exit(1);
    }
  });
});