const bcrypt = require('bcryptjs');
const db = require('../config/db.config');

// Create User table schema (if not exists)
const createUserTable = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255),
      email VARCHAR(255) UNIQUE,
      password VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log('Users table created or exists already');
  });
};

// Insert a new user with hashed password
const addUser = (name, email, password, callback) => {
  // Hash password before saving to database
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) return callback(err);

    const sql = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;
    db.query(sql, [name, email, hashedPassword], (err, result) => {
      if (err) return callback(err);
      callback(null, result);
    });
  });
};

// Get user by email for login
const getUserByEmail = (email, callback) => {
  const sql = `SELECT * FROM users WHERE email = ?`;
  db.query(sql, [email], (err, results) => {
    if (err) return callback(err)
    callback(null, results[0]);
  });
};

module.exports = { createUserTable, addUser, getUserByEmail };