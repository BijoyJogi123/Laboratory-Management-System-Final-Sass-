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

// Create a fresh hash for Test@123
async function createTestUser() {
  const password = 'Test@123';
  const hash = await bcrypt.hash(password, 10);
  
  return {
    id: 1,
    name: 'Test User',
    email: 'test@lab.com',
    password: hash,
    tenant_id: 1
  };
}

let testUser = null;

// Initialize user
(async () => {
  testUser = await createTestUser();
  console.log('👤 Test user created successfully');
  console.log('   📧 Email:', testUser.email);
  console.log('   🔑 Password: Test@123');
})();

console.log('🚀 Starting Laboratory Management System Backend (v2.0 - No DB Mode)...');
console.log('📧 Test Email: test@lab.com');
console.log('🔑 Test Password: Test@123');
console.log('⚠️  Running in NO-DB mode - Install database schema to enable full features');

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
  console.log('\n🔐 ===== LOGIN ATTEMPT =====');
  console.log('📧 Email:', req.body.email);
  
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  if (!testUser) {
    return res.status(500).json({ message: 'Server not ready, please try again' });
  }

  if (email !== testUser.email) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  try {
    const isMatch = await bcrypt.compare(password, testUser.password);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { 
        userId: testUser.id, 
        email: testUser.email,
        tenant_id: testUser.tenant_id 
      }, 
      JWT_SECRET, 
      { expiresIn: '24h' }
    );

    console.log('✅ Login successful for:', email);
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
    message: 'Laboratory Management System Backend v2.0 (No-DB Mode)',
    version: '2.0.0',
    mode: 'no-database',
    timestamp: new Date().toISOString(),
    testUser: testUser ? {
      email: testUser.email,
      initialized: true
    } : {
      initialized: false
    },
    notice: 'Install database schema to enable full features',
    setup_instructions: {
      step1: 'Run: mysql -u root -p laboratory < DATABASE_SCHEMA_UPGRADE.sql',
      step2: 'Update backend/.env with correct MySQL password',
      step3: 'Restart with: node server-upgraded.js'
    },
    modules: {
      authentication: 'Active',
      billing: 'Requires Database',
      emi: 'Requires Database',
      ledger: 'Requires Database',
      packages: 'Requires Database',
      patients: 'Mock Data Available',
      tests: 'Mock Data Available'
    },
    endpoints: {
      login: 'POST /api/auth/login-user',
      health: 'GET /api/health',
      patients: 'GET /api/patients/all-patients',
      tests: 'GET /api/tests/all-tests'
    }
  });
});

// Mock Patients endpoints (existing functionality)
app.get('/api/patients/all-patients', verifyToken, (req, res) => {
  console.log('📋 Fetching all patients for user:', req.user.email);
  
  const patients = [
    {
      id: 1,
      sales_id: 1001,
      patient_name: 'John Doe',
      patient_contact: '123-456-7890',
      patient_type: 'OPD',
      age: 30,
      gender: 'Male',
      ref_doctor: 'Dr. Smith',
      email: 'john@example.com',
      created_at: '2024-01-15T10:30:00Z'
    },
    {
      id: 2,
      sales_id: 1002,
      patient_name: 'Jane Smith',
      patient_contact: '098-765-4321',
      patient_type: 'IPD',
      age: 25,
      gender: 'Female',
      ref_doctor: 'Dr. Johnson',
      email: 'jane@example.com',
      created_at: '2024-02-20T14:15:00Z'
    }
  ];
  
  res.json(patients);
});

app.get('/api/patients/all-patients-tests', verifyToken, (req, res) => {
  console.log('🧪 Fetching all patient tests for user:', req.user.email);
  
  const patientTests = [
    {
      sales_item_id: 1001,
      patient_name: 'John Doe',
      item_name: 'Blood Test',
      price: 150.00,
      status: 'Completed',
      created_at: '2024-10-15T10:30:00Z'
    }
  ];
  
  res.json(patientTests);
});

app.post('/api/patients/add-patients', verifyToken, (req, res) => {
  console.log('➕ Adding new patient:', req.body);
  res.json({ 
    success: true,
    message: 'Patient added successfully (mock)',
    patient: {
      id: Date.now(),
      ...req.body,
      created_at: new Date().toISOString()
    }
  });
});

// Mock Tests endpoints
app.get('/api/tests/all-tests', verifyToken, (req, res) => {
  console.log('🧪 Fetching all tests for user:', req.user.email);
  
  const tests = [
    {
      test_id: 1,
      test_name: 'Blood Test',
      unit: 'mg/dL',
      ref_value: '12-16',
      description: 'Complete Blood Count',
      price: 150.00,
      category: 'Hematology'
    },
    {
      test_id: 2,
      test_name: 'Urine Test',
      unit: 'pH',
      ref_value: '4.5-8.0',
      description: 'Urinalysis',
      price: 80.00,
      category: 'Clinical Chemistry'
    }
  ];
  
  res.json(tests);
});

app.get('/api/tests/all-items', verifyToken, (req, res) => {
  const items = [
    {
      item_id: 1,
      test_id: 1,
      item_name: 'Hemoglobin Test',
      ref_value: '12-16',
      unit: 'g/dL',
      price: 50.00
    }
  ];
  
  res.json(items);
});

app.post('/api/tests/create-test', verifyToken, (req, res) => {
  console.log('➕ Creating new test:', req.body);
  res.json({ 
    success: true,
    message: 'Test created successfully (mock)',
    test: {
      id: Date.now(),
      ...req.body,
      created_at: new Date().toISOString()
    }
  });
});

// Users endpoint
app.get('/api/user/users', verifyToken, (req, res) => {
  console.log('👥 Fetching users for:', req.user.email);
  res.json({ 
    success: true,
    message: 'Users retrieved successfully',
    users: [{ 
      id: testUser?.id || 1, 
      name: testUser?.name || 'Test User', 
      email: testUser?.email || 'test@lab.com',
      role: 'Admin',
      created_at: new Date().toISOString()
    }],
    user: req.user
  });
});

// Database-required endpoints (return helpful messages)
app.all('/api/billing/*', verifyToken, (req, res) => {
  res.status(503).json({
    success: false,
    message: 'Billing module requires database connection',
    instructions: {
      step1: 'Install database schema: mysql -u root -p laboratory < DATABASE_SCHEMA_UPGRADE.sql',
      step2: 'Update backend/.env with correct MySQL password',
      step3: 'Restart with: node server-upgraded.js'
    }
  });
});

app.all('/api/emi/*', verifyToken, (req, res) => {
  res.status(503).json({
    success: false,
    message: 'EMI module requires database connection',
    instructions: 'Install database schema first'
  });
});

app.all('/api/ledger/*', verifyToken, (req, res) => {
  res.status(503).json({
    success: false,
    message: 'Ledger module requires database connection',
    instructions: 'Install database schema first'
  });
});

app.all('/api/packages/*', verifyToken, (req, res) => {
  res.status(503).json({
    success: false,
    message: 'Packages module requires database connection',
    instructions: 'Install database schema first'
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    method: req.method,
    url: req.originalUrl
  });
});

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log('');
  console.log('🌟 ================================');
  console.log('🌟 SERVER RUNNING SUCCESSFULLY!');
  console.log('🌟 VERSION 2.0.0 - NO-DB MODE');
  console.log('🌟 ================================');
  console.log(`🔗 Server URL: http://localhost:${PORT}`);
  console.log(`🔐 Login endpoint: http://localhost:${PORT}/api/auth/login-user`);
  console.log(`💊 Health check: http://localhost:${PORT}/api/health`);
  console.log('');
  console.log('📋 TEST CREDENTIALS:');
  console.log('   📧 Email: test@lab.com');
  console.log('   🔑 Password: Test@123');
  console.log('');
  console.log('⚠️  NOTICE: Running in NO-DB mode');
  console.log('   Your existing features work fine!');
  console.log('   To enable new features:');
  console.log('   1. Fix MySQL password in backend/.env');
  console.log('   2. Run: mysql -u root -p laboratory < DATABASE_SCHEMA_UPGRADE.sql');
  console.log('   3. Restart with: node server-upgraded.js');
  console.log('');
  console.log('✨ Ready to accept requests!');
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use`);
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
