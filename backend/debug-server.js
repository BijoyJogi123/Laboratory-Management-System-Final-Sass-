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

console.log('🚀 Starting Debug Server...');

// Generate fresh password hash
const generateHash = () => {
  return new Promise((resolve, reject) => {
    bcrypt.hash('Test@123', 10, (err, hash) => {
      if (err) reject(err);
      else resolve(hash);
    });
  });
};

let testUser = null;

// Initialize user with fresh hash
const initializeUser = async () => {
  try {
    const passwordHash = await generateHash();
    testUser = {
      id: 1,
      name: 'Test User',
      email: 'test@lab.com',
      password: passwordHash
    };
    
    console.log('✅ User initialized with fresh password hash');
    console.log('📧 Email: test@lab.com');
    console.log('🔑 Password: Test@123');
    console.log('🔐 Hash:', passwordHash);
    
    // Test the hash immediately
    const testResult = await bcrypt.compare('Test@123', passwordHash);
    console.log('🧪 Hash test result:', testResult ? 'PASS' : 'FAIL');
    
  } catch (error) {
    console.error('❌ Error initializing user:', error);
  }
};

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

// Login endpoint with detailed logging
app.post('/api/auth/login-user', async (req, res) => {
  console.log('\n🔐 ===== LOGIN ATTEMPT =====');
  console.log('📧 Email received:', req.body.email);
  console.log('🔑 Password received:', req.body.password);
  console.log('📊 Request body:', JSON.stringify(req.body, null, 2));
  
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    console.log('❌ Missing email or password');
    return res.status(400).json({ message: 'Email and password are required' });
  }

  // Check if user is initialized
  if (!testUser) {
    console.log('❌ Test user not initialized');
    return res.status(500).json({ message: 'Server not ready' });
  }

  // Check email
  console.log('🔍 Comparing emails:');
  console.log('   Received:', email);
  console.log('   Expected:', testUser.email);
  console.log('   Match:', email === testUser.email);
  
  if (email !== testUser.email) {
    console.log('❌ Email does not match');
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  try {
    // Compare password with detailed logging
    console.log('🔍 Comparing passwords:');
    console.log('   Received password:', password);
    console.log('   Stored hash:', testUser.password);
    
    const isMatch = await bcrypt.compare(password, testUser.password);
    console.log('   Comparison result:', isMatch);
    
    if (!isMatch) {
      console.log('❌ Password does not match');
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: testUser.id, email: testUser.email }, 
      JWT_SECRET, 
      { expiresIn: '1h' }
    );

    console.log('✅ Login successful!');
    console.log('🎫 Token generated:', token.substring(0, 20) + '...');
    console.log('===========================\n');
    
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
    message: 'Debug server is running',
    timestamp: new Date().toISOString(),
    userInitialized: testUser ? true : false,
    credentials: {
      email: 'test@lab.com',
      password: 'Test@123'
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
    url: req.originalUrl
  });
});

// Start server
const PORT = process.env.PORT || 5001; // Use different port to avoid conflicts
const startServer = async () => {
  await initializeUser();
  
  const server = app.listen(PORT, () => {
    console.log('\n🌟 ================================');
    console.log('🌟 DEBUG SERVER RUNNING!');
    console.log('🌟 ================================');
    console.log(`🔗 Server URL: http://localhost:${PORT}`);
    console.log(`🔐 Login endpoint: http://localhost:${PORT}/api/auth/login-user`);
    console.log(`💊 Health check: http://localhost:${PORT}/api/health`);
    console.log('');
    console.log('📋 TEST CREDENTIALS:');
    console.log('   📧 Email: test@lab.com');
    console.log('   🔑 Password: Test@123');
    console.log('');
    console.log('✨ Ready for testing!');
  });

  // Handle server errors
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`❌ Port ${PORT} is already in use`);
    } else {
      console.error('❌ Server error:', err);
    }
  });
};

startServer();