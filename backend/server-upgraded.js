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
    tenant_id: 1 // Default tenant
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

console.log('🚀 Starting Laboratory Management System Backend (UPGRADED)...');
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

// =====================================================
// IMPORT NEW ROUTES
// =====================================================
const billingRoutes = require('./routes/billingRoutes');
const emiRoutes = require('./routes/emiRoutes');
const ledgerRoutes = require('./routes/ledgerRoutes');
const packageRoutes = require('./routes/packageRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const testOrderRoutes = require('./routes/testOrderRoutes');
const patientPortalRoutes = require('./routes/patientPortalRoutes');
const templateRoutes = require('./routes/templateRoutes');

// =====================================================
// USE NEW ROUTES
// =====================================================
app.use('/api/billing', billingRoutes);
app.use('/api/emi', emiRoutes);
app.use('/api/ledger', ledgerRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/test-orders', testOrderRoutes);
app.use('/api/portal', patientPortalRoutes);
app.use('/api/templates', templateRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Laboratory Management System Backend (UPGRADED) is running',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    testUser: testUser ? {
      email: testUser.email,
      initialized: true
    } : {
      initialized: false
    },
    modules: {
      billing: 'Active ✅',
      emi: 'Active ✅',
      ledger: 'Active ✅',
      packages: 'Active ✅',
      inventory: 'Active ✅',
      doctors: 'Active ✅',
      testOrders: 'Active ✅',
      patientPortal: 'Active ✅',
      templates: 'Active ✅',
      saasAdmin: 'Coming Soon (Optional)'
    },
    endpoints: {
      // Authentication
      login: 'POST /api/auth/login-user',
      health: 'GET /api/health',
      
      // Billing Module (NEW)
      createInvoice: 'POST /api/billing/invoices',
      getAllInvoices: 'GET /api/billing/invoices',
      getInvoice: 'GET /api/billing/invoices/:id',
      recordPayment: 'POST /api/billing/invoices/:id/payment',
      invoiceStats: 'GET /api/billing/invoices/stats',
      
      // EMI Module (NEW)
      createEMIPlan: 'POST /api/emi/plans',
      getAllEMIPlans: 'GET /api/emi/plans',
      getEMIPlan: 'GET /api/emi/plans/:id',
      getDueInstallments: 'GET /api/emi/installments/due',
      payInstallment: 'POST /api/emi/installments/:id/pay',
      emiStats: 'GET /api/emi/stats',
      
      // Ledger Module (NEW)
      getPartyLedger: 'GET /api/ledger/party/:partyId',
      addLedgerEntry: 'POST /api/ledger/entry',
      getAllParties: 'GET /api/ledger/parties',
      ledgerSummary: 'GET /api/ledger/summary',
      exportLedgerPDF: 'GET /api/ledger/party/:partyId/export/pdf',
      
      // Package Module (NEW)
      createPackage: 'POST /api/packages',
      getAllPackages: 'GET /api/packages',
      getPackage: 'GET /api/packages/:id',
      updatePackage: 'PUT /api/packages/:id',
      deletePackage: 'DELETE /api/packages/:id',
      packageStats: 'GET /api/packages/stats',
      
      // Patients (Existing)
      getAllPatients: 'GET /api/patients/all-patients',
      addPatient: 'POST /api/patients/add-patients',
      
      // Tests (Existing)
      getAllTests: 'GET /api/tests/all-tests',
      createTest: 'POST /api/tests/create-test',
      
      // Reports (Existing)
      getReport: 'GET /api/reports/report/:sales_item_id',
      submitReport: 'POST /api/reports/submit',
      
      // Users (Existing)
      getUsers: 'GET /api/user/users'
    }
  });
});

// =====================================================
// EXISTING ROUTES (Keep your current functionality)
// =====================================================

// Patients endpoints
app.get('/api/patients/all-patients', verifyToken, (req, res) => {
  console.log('📋 Fetching all patients for user:', req.user.email);
  
  const patients = [
    {
      id: 1,
      sales_id: 1001,
      patient_name: 'John Doe',
      patient_contact: '123-456-7890',
      patient_type: 'OPD',
      addm_id: 'ADM001',
      prn_id: 'PRN001',
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
      addm_id: 'ADM002',
      prn_id: 'PRN002',
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
      dis_perc: 10,
      dis_value: 15.00,
      tax_perc: 5,
      tax_value: 7.50,
      status: 'Completed',
      created_at: '2024-10-15T10:30:00Z'
    },
    {
      sales_item_id: 1002,
      patient_name: 'Jane Smith',
      item_name: 'Urine Test',
      price: 80.00,
      dis_perc: 5,
      dis_value: 4.00,
      tax_perc: 5,
      tax_value: 4.00,
      status: 'In-Progress',
      created_at: '2024-11-01T14:15:00Z'
    }
  ];
  
  res.json(patientTests);
});

app.post('/api/patients/add-patients', verifyToken, (req, res) => {
  console.log('➕ Adding new patient:', req.body);
  res.json({ 
    success: true,
    message: 'Patient added successfully',
    patient: {
      id: Date.now(),
      ...req.body,
      created_at: new Date().toISOString()
    }
  });
});

// Tests endpoints
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
      category: 'Hematology',
      created_at: '2024-01-10T08:00:00Z'
    },
    {
      test_id: 2,
      test_name: 'Urine Test',
      unit: 'pH',
      ref_value: '4.5-8.0',
      description: 'Urinalysis',
      price: 80.00,
      category: 'Clinical Chemistry',
      created_at: '2024-01-15T09:30:00Z'
    }
  ];
  
  res.json(tests);
});

app.get('/api/tests/all-items', verifyToken, (req, res) => {
  console.log('📋 Fetching all test items for user:', req.user.email);
  
  const items = [
    {
      item_id: 1,
      test_id: 1,
      item_name: 'Hemoglobin Test',
      ref_value: '12-16',
      unit: 'g/dL',
      price: 50.00,
      related_test: '1',
      normal_range: '12-16 g/dL',
      created_at: '2024-01-10T08:00:00Z'
    }
  ];
  
  res.json(items);
});

app.post('/api/tests/create-test', verifyToken, (req, res) => {
  console.log('➕ Creating new test:', req.body);
  res.json({ 
    success: true,
    message: 'Test created successfully',
    test: {
      id: Date.now(),
      ...req.body,
      created_at: new Date().toISOString()
    }
  });
});

// Users endpoints
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
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log('');
  console.log('🌟 ================================');
  console.log('🌟 SERVER RUNNING SUCCESSFULLY!');
  console.log('🌟 VERSION 2.0.0 - UPGRADED');
  console.log('🌟 ================================');
  console.log(`🔗 Server URL: http://localhost:${PORT}`);
  console.log(`🔐 Login endpoint: http://localhost:${PORT}/api/auth/login-user`);
  console.log(`💊 Health check: http://localhost:${PORT}/api/health`);
  console.log('');
  console.log('📋 TEST CREDENTIALS:');
  console.log('   📧 Email: test@lab.com');
  console.log('   🔑 Password: Test@123');
  console.log('');
  console.log('🆕 NEW MODULES AVAILABLE:');
  console.log('   💰 Billing System');
  console.log('   💳 EMI Management');
  console.log('   📊 Party Ledger');
  console.log('   📦 Test Packages');
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
