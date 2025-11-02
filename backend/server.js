const express = require("express");
const cors = require("cors");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Initialize dotenv
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'Boom#123';

// Test user with pre-hashed password
const testUser = {
  id: 1,
  name: 'Test User',
  email: 'test@lab.com',
  // This is the hash for 'Test@123'
  password: '$2a$10$vI8aWY99Qk/d5Zqm4qjvW.bxhyW98CopA2oysmO/YzEGdStVj3C4.'
};

console.log('🚀 Starting Laboratory Management System Backend...');
console.log('📧 Test Email: test@lab.com');
console.log('🔑 Test Password: Test@123');

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
  console.log('🔐 Login attempt received');
  console.log('📧 Email:', req.body.email);
  console.log('🔑 Password provided:', req.body.password ? 'Yes' : 'No');
  
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    console.log('❌ Missing email or password');
    return res.status(400).json({ message: 'Email and password are required' });
  }

  // Check if user exists
  if (email !== testUser.email) {
    console.log('❌ User not found:', email);
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  try {
    // Compare password
    const isMatch = await bcrypt.compare(password, testUser.password);
    console.log('🔍 Password comparison result:', isMatch);
    
    if (!isMatch) {
      console.log('❌ Invalid password for:', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: testUser.id, email: testUser.email }, 
      JWT_SECRET, 
      { expiresIn: '1h' }
    );

    console.log('✅ Login successful for:', email);
    console.log('🎫 Token generated');
    
    res.json({ token });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Backend is running',
    timestamp: new Date().toISOString(),
    endpoints: {
      login: '/api/auth/login-user',
      health: '/api/health'
    }
  });
});

// Test protected routes
app.get('/api/patients/all-patients', verifyToken, (req, res) => {
  res.json({ 
    message: 'Patients endpoint working',
    patients: [],
    user: req.user
  });
});

app.get('/api/tests/all-tests', verifyToken, (req, res) => {
  res.json({ 
    message: 'Tests endpoint working',
    tests: [],
    user: req.user
  });
});

app.get('/api/user/users', verifyToken, (req, res) => {
  res.json({ 
    message: 'Users endpoint working',
    users: [{ id: testUser.id, name: testUser.name, email: testUser.email }],
    user: req.user
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  console.log('❌ 404 - Route not found:', req.method, req.originalUrl);
  res.status(404).json({ 
    message: 'Route not found',
    method: req.method,
    url: req.originalUrl,
    availableRoutes: [
      'POST /api/auth/login-user',
      'GET /api/health',
      'GET /api/patients/all-patients (protected)',
      'GET /api/tests/all-tests (protected)',
      'GET /api/user/users (protected)'
    ]
  });
});

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log('');
  console.log('🌟 ================================');
  console.log('🌟 SERVER RUNNING SUCCESSFULLY!');
  console.log('🌟 ================================');
  console.log(`🔗 Server URL: http://localhost:${PORT}`);
  console.log(`🔐 Login endpoint: http://localhost:${PORT}/api/auth/login-user`);
  console.log(`💊 Health check: http://localhost:${PORT}/api/health`);
  console.log('');
  console.log('📋 TEST CREDENTIALS:');
  console.log('   📧 Email: test@lab.com');
  console.log('   🔑 Password: Test@123');
  console.log('');
  console.log('✨ Ready to accept requests!');
});

// Handle server errors
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use`);
    console.log('💡 Try stopping other servers or use a different port');
  } else {
    console.error('❌ Server error:', err);
  }
});

process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});





