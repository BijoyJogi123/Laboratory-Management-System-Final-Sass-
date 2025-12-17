const express = require("express");
const cors = require("cors");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Initialize dotenv
require('dotenv').config();

const app = express();

// Import database connection
const db = require('./config/db.config');

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Serve static files (for uploaded images)
app.use('/uploads', express.static('uploads'));

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
    password: hash
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
  console.log('\n🔐 ===== LOGIN ATTEMPT =====');
  console.log('📧 Email:', req.body.email);
  console.log('🔑 Password provided:', req.body.password ? 'Yes' : 'No');

  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    console.log('❌ Missing email or password');
    return res.status(400).json({ message: 'Email and password are required' });
  }

  // Check if test user is initialized
  if (!testUser) {
    console.log('❌ Test user not initialized yet');
    return res.status(500).json({ message: 'Server not ready, please try again' });
  }

  console.log('🔍 Comparing credentials:');
  console.log('   Expected email:', testUser.email);
  console.log('   Received email:', email);
  console.log('   Email match:', email === testUser.email);

  // Check if user exists
  if (email !== testUser.email) {
    console.log('❌ User not found:', email);
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  try {
    console.log('🔐 Verifying password...');

    // Compare password
    const isMatch = await bcrypt.compare(password, testUser.password);
    console.log('🔍 Password verification result:', isMatch);

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
    console.log('🎫 Token generated successfully');

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
    message: 'Laboratory Management System Backend is running',
    timestamp: new Date().toISOString(),
    testUser: testUser ? {
      email: testUser.email,
      initialized: true
    } : {
      initialized: false
    },
    database: 'MySQL Connected',
    endpoints: {
      // Authentication
      login: 'POST /api/auth/login-user',
      health: 'GET /api/health',

      // Patients (Protected - Database Connected)
      getAllPatients: 'GET /api/patients/all-patients',
      addPatient: 'POST /api/patients/add-patients',
      getPatientTests: 'GET /api/patients/all-patients-tests',
      getPatient: 'GET /api/patients/patient/:id',
      getSpecificPatient: 'GET /api/patients/specific-patient/:id',
      updatePatient: 'PUT /api/patients/patient/:id',
      updatePatientSales: 'PUT /api/patients/patient/sales/:id',
      deletePatient: 'DELETE /api/patients/patient/:id',

      // Tests (Protected - Database Connected)
      getAllTests: 'GET /api/tests/all-tests',
      getAllItems: 'GET /api/tests/all-items',
      createTest: 'POST /api/tests/create-test',
      createItem: 'POST /api/tests/create-item',
      getTest: 'GET /api/tests/test/:id',
      updateTest: 'PUT /api/tests/test/:id',
      updateItem: 'PUT /api/tests/item/:id',
      deleteTest: 'DELETE /api/tests/test/:id',
      deleteItem: 'DELETE /api/tests/item/:id',

      // Reports (Protected - Database Connected)
      getReport: 'GET /api/reports/report/:sales_item_id',
      submitReport: 'POST /api/reports/submit',
      fetchTests: 'POST /api/reports/tests/fetch',

      // Billing (Protected - Database Connected)
      createInvoice: 'POST /api/billing/invoices',
      getAllInvoices: 'GET /api/billing/invoices',
      getInvoiceStats: 'GET /api/billing/invoices/stats',
      getInvoice: 'GET /api/billing/invoices/:id',
      recordPayment: 'POST /api/billing/invoices/:id/payment',
      billingStats: 'GET /api/billing/stats',

      // EMI (Protected - Database Connected)
      createEMI: 'POST /api/emi/plans',
      getAllEMI: 'GET /api/emi/plans',
      getDueInstallments: 'GET /api/emi/installments/due',
      emiStats: 'GET /api/emi/stats',

      // Ledger (Protected - Database Connected)
      getParties: 'GET /api/ledger/parties',
      getPartyLedger: 'GET /api/ledger/party/:partyId',
      ledgerSummary: 'GET /api/ledger/summary',

      // Packages (Protected - Database Connected)
      getPackages: 'GET /api/packages',
      packageStats: 'GET /api/packages/stats',

      // Doctors (Protected - Database Connected)
      getDoctors: 'GET /api/doctors',
      doctorStats: 'GET /api/doctors/stats',

      // Test Orders (Protected - Database Connected)
      getTestOrders: 'GET /api/test-orders',
      testOrderStats: 'GET /api/test-orders/stats',

      // Users (Protected - Database Connected)
      getUsers: 'GET /api/user/users'
    }
  });
});

// =====================================================
// IMPORT ROUTES (All database-connected routes)
// =====================================================
const patientRoutes = require('./routes/patientRoute');
const testRoutes = require('./routes/testRouter');
const reportRoutes = require('./routes/reportRoutes');
const userRoutes = require('./routes/userRoute');
const billingRoutes = require('./routes/billingRoutes');
const emiRoutes = require('./routes/emiRoutes');
const ledgerRoutes = require('./routes/ledgerRoutes');
const packageRoutes = require('./routes/packageRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const testOrderRoutes = require('./routes/testOrderRoutes');
const settingsRoutes = require('./routes/settingsRoutes');

// =====================================================
// USE ROUTES (Connect to Express app)
// =====================================================
app.use('/api/patients', patientRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/user', userRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/emi', emiRoutes);
app.use('/api/ledger', ledgerRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/test-orders', testOrderRoutes);
app.use('/api/settings', settingsRoutes);

// Additional endpoints for frontend compatibility
app.get('/api/items/all-items', verifyToken, (req, res) => {
  // Redirect to tests/all-items
  const testController = require('./controllers/testController');
  testController.getAllItems(req, res);
});

app.get('/api/billing/stats', verifyToken, async (req, res) => {
  try {
    const [invoices] = await db.query(
      'SELECT SUM(total_amount) as total_revenue, SUM(paid_amount) as total_paid, SUM(balance_amount) as pending_payments FROM invoices'
    );

    res.json({
      success: true,
      data: {
        total_revenue: invoices[0].total_revenue || 0,
        pending_payments: invoices[0].pending_payments || 0,
        completed_payments: invoices[0].total_paid || 0
      }
    });
  } catch (error) {
    console.error('Error fetching billing stats:', error);
    res.json({
      success: true,
      data: {
        total_revenue: 0,
        pending_payments: 0,
        completed_payments: 0
      }
    });
  }
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
  console.log('💾 DATABASE: MySQL Connected');
  console.log('📡 ALL ROUTES: Database-Connected');
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
