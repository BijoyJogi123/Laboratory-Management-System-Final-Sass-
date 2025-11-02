// Script to create a test user
const User = require('./models/userModel');
const db = require('./config/db.config');

console.log('Starting test user creation...');

// Create a test user
const testUser = {
  name: 'Test User',
  email: 'test@lab.com',
  password: 'Test@123'
};

console.log('Attempting to create user with email:', testUser.email);

User.addUser(testUser.name, testUser.email, testUser.password, (err, result) => {
  if (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      console.log('Test user already exists!');
      console.log('Email: test@lab.com');
      console.log('Password: Test@123');
    } else {
      console.error('Error creating test user:', err);
    }
    process.exit(1);
  }

  console.log('Test user created successfully!');
  console.log('Email: test@lab.com');
  console.log('Password: Test@123');
  console.log('User ID:', result.insertId);
  process.exit(0);
});
