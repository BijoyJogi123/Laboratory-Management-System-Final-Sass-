// Script to create a test user for authentication testing
const bcrypt = require('bcryptjs');
const mysql = require('mysql2');
require('dotenv').config();

// Database connection
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Test user credentials
const testUser = {
  name: 'Test User',
  email: 'test@lab.com',
  password: 'Test@123'
};

// Create test user
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    process.exit(1);
  }

  console.log('Connected to database');

  // Hash the password
  bcrypt.hash(testUser.password, 10, (err, hashedPassword) => {
    if (err) {
      console.error('Error hashing password:', err);
      connection.end();
      process.exit(1);
    }

    // Insert user into database
    const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    connection.query(sql, [testUser.name, testUser.email, hashedPassword], (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          console.log('User already exists!');
        } else {
          console.error('Error creating user:', err);
        }
        connection.end();
        process.exit(1);
      }

      console.log('✓ Test user created successfully!');
      console.log('─────────────────────────────────');
      console.log('Email:', testUser.email);
      console.log('Password:', testUser.password);
      console.log('User ID:', result.insertId);
      console.log('─────────────────────────────────');
      console.log('You can now use these credentials to login');

      connection.end();
      process.exit(0);
    });
  });
});
