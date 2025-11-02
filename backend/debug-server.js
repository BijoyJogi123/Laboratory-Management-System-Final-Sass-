const express = require("express");
const cors = require("cors");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Create a fresh hash for Test@123
async function createTestUser() {
  const password = 'Test@123';
  const hash = await bcrypt.hash(password, 10);
  
  return {
    id: 1,
    name: 'Test User',
    email: 'test@lab.com',
    password: hash
  };
}

let testUser = null;

// Initialize user
(async () => {
  testUser = await createTestUser();
  console.log('👤 Test user created:');
  console.log('   📧 Email:', testUser.email);
  console.log('   🔑 Password: Test@123');
  console.log('   🔐 Hash:', testUser.password);
})();

// Login endpoint with detailed logging
app.post('/api/auth/login-user', async (req, res) => {
  console.log('\n🔐 ===== LOGIN ATTEMPT =====');
  console.log('📧 Received email:', req.body.email);
  console.log('🔑 Received password:', req.body.password);
  console.log('📦 Full request body:', JSON.stringify(req.body, null, 2));
  
  const { email, password } = req.body;

  if (!email || !password) {
    console.log('❌ Missing credentials');
    return res.status(400).json({ message: 'Email and password are required' });
  }

  if (!testUser) {
    console.log('❌ Test user not initialized');
    return res.status(500).json({ message: 'Server not ready' });
  }

  console.log('🔍 Comparing with test user:');
  console.log('   Expected email:', testUser.email);
  console.log('   Email match:', email === testUser.email);

  if (email !== testUser.email) {
    console.log('❌ Email mismatch');
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  try {
    console.log('🔐 Comparing passwords...');
    console.log('   Input password:', password);
    console.log('   Stored hash:', testUser.password);
    
    const isMatch = await bcrypt.compare(password, testUser.password);
    console.log('   🔍 Password match result:', isMatch);
    
    if (!isMatch) {
      console.log('❌ Password verification failed');
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { userId: testUser.id, email: testUser.email }, 
      'Boom#123', 
      { expiresIn: '1h' }
    );

    console.log('✅ Login successful!');
    console.log('🎫 Token generated:', token.substring(0, 50) + '...');
    
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
    testUser: testUser ? {
      email: testUser.email,
      hasPassword: !!testUser.password
    } : null
  });
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log('\n🌟 ================================');
  console.log('🌟 DEBUG SERVER RUNNING!');
  console.log('🌟 ================================');
  console.log(`🔗 Server URL: http://localhost:${PORT}`);
  console.log(`🔐 Login endpoint: http://localhost:${PORT}/api/auth/login-user`);
  console.log(`💊 Health check: http://localhost:${PORT}/api/health`);
  console.log('\n📋 TEST CREDENTIALS:');
  console.log('   📧 Email: test@lab.com');
  console.log('   🔑 Password: Test@123');
  console.log('\n✨ Ready for debugging!');
});