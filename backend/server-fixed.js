const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Initialize dotenv first
require('dotenv').config();

console.log('🚀 Starting Laboratory Management System Backend...');
console.log('📊 Environment:', process.env.NODE_ENV || 'development');
console.log('🔧 Port:', process.env.PORT || 5000);

// Create express app
const app = express();

// Middleware for parsing JSON
app.use(express.json());
app.use(bodyParser.json());

app.use(cors({
  origin: 'http://localhost:3000'
}));

// In-memory user storage for testing (replace with database later)
const users = [
  {
    id: 1,
    name: 'Test User',
    email: 'test@lab.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' // Test@123
  }
];

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'Boom#123';

// Auth middleware
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.startsWith('Bearer ') 
    ? authHeader.slice(7) 
    : authHeader;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Login endpoint
app.post('/api/auth/login-user', async (req, res) => {
  console.log('🔐 Login attempt:', req.body.email);
  
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  // Find user
  const user = users.find(u => u.email === email);
  if (!user) {
    console.log('❌ User not found:', email);
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  // Check password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    console.log('❌ Invalid password for:', email);
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  // Generate token
  const token = jwt.sign(
    { userId: user.id, email: user.email }, 
    JWT_SECRET, 
    { expiresIn: '1h' }
  );

  console.log('✅ Login successful for:', email);
  res.json({ token });
});

// Test protected endpoint
app.get('/api/test/protected', verifyToken, (req, res) => {
  res.json({ 
    message: 'This is a protected route', 
    user: req.user 
  });
});

// Basic endpoints for testing
app.get('/api/patients/all-patients', verifyToken, (req, res) => {
  res.json({ 
    message: 'Patients endpoint working',
    patients: []
  });
});

app.get('/api/tests/all-tests', verifyToken, (req, res) => {
  res.json({ 
    message: 'Tests endpoint working',
    tests: []
  });
});

app.get('/api/user/users', verifyToken, (req, res) => {
  res.json({ 
    message: 'Users endpoint working',
    users: users.map(u => ({ id: u.id, name: u.name, email: u.email }))
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Backend is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🌟 Server running successfully on port ${PORT}`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}`);
  console.log(`🔐 Auth endpoint: http://localhost:${PORT}/api/auth/login-user`);
  console.log(`💊 Health check: http://localhost:${PORT}/api/health`);
  console.log('✨ Backend is ready to accept requests!');
  console.log('');
  console.log('📋 Test Credentials:');
  console.log('   Email: test@lab.com');
  console.log('   Password: Test@123');
});