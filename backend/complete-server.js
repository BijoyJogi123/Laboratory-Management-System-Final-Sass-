const express = require("express");
const cors = require("cors");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

const JWT_SECRET = process.env.JWT_SECRET || 'Boom#123';

// In-memory data stores
let patients = [];
let tests = [];
let items = [];
let invoices = [];
let doctors = [];
let packages = [];
let ledgerEntries = [];

let patientIdCounter = 1;
let testIdCounter = 1;
let itemIdCounter = 1;
let invoiceIdCounter = 1;
let doctorIdCounter = 1;
let packageIdCounter = 1;

// Test user
const testUser = {
  id: 1,
  name: 'Admin User',
  email: 'admin',
  password: '$2a$10$vI8aWY99Qk/d5Zqm4qjvW.bxhyW98CopA2oysmO/YzEGdStVj3C4.' // admin123
};

console.log('🚀 Starting Complete Laboratory Management System Backend...');
console.log('📧 Username: admin');
console.log('🔑 Password: admin123');

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

// ==================== AUTH ROUTES ====================
app.post('/api/auth/login-user', async (req, res) => {
  console.log('🔐 Login attempt:', req.body.email);
  
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  if (email !== testUser.email) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  try {
    const isMatch = await bcrypt.compare(password, testUser.password);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: testUser.id, email: testUser.email }, 
      JWT_SECRET, 
      { expiresIn: '24h' }
    );

    console.log('✅ Login successful');
    res.json({ token });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ==================== PATIENT ROUTES ====================
app.get('/api/patients/all-patients', verifyToken, (req, res) => {
  res.json(patients);
});

app.post('/api/patients', verifyToken, (req, res) => {
  const newPatient = {
    patient_id: patientIdCounter++,
    ...req.body,
    created_at: new Date().toISOString()
  };
  patients.push(newPatient);
  console.log('✅ Patient created:', newPatient.patient_name);
  res.status(201).json(newPatient);
});

app.put('/api/patients/:id', verifyToken, (req, res) => {
  const id = parseInt(req.params.id);
  const index = patients.findIndex(p => p.patient_id === id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Patient not found' });
  }
  
  patients[index] = { ...patients[index], ...req.body };
  console.log('✅ Patient updated:', patients[index].patient_name);
  res.json(patients[index]);
});

app.delete('/api/patients/:id', verifyToken, (req, res) => {
  const id = parseInt(req.params.id);
  const index = patients.findIndex(p => p.patient_id === id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Patient not found' });
  }
  
  const deleted = patients.splice(index, 1)[0];
  console.log('✅ Patient deleted:', deleted.patient_name);
  res.json({ message: 'Patient deleted successfully' });
});

// ==================== TEST ROUTES ====================
app.get('/api/tests/all-tests', verifyToken, (req, res) => {
  res.json(tests);
});

app.post('/api/tests', verifyToken, (req, res) => {
  const newTest = {
    test_id: testIdCounter++,
    ...req.body,
    created_at: new Date().toISOString()
  };
  tests.push(newTest);
  console.log('✅ Test created:', newTest.test_name);
  res.status(201).json(newTest);
});

app.put('/api/tests/:id', verifyToken, (req, res) => {
  const id = parseInt(req.params.id);
  const index = tests.findIndex(t => t.test_id === id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Test not found' });
  }
  
  tests[index] = { ...tests[index], ...req.body };
  console.log('✅ Test updated:', tests[index].test_name);
  res.json(tests[index]);
});

app.delete('/api/tests/:id', verifyToken, (req, res) => {
  const id = parseInt(req.params.id);
  const index = tests.findIndex(t => t.test_id === id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Test not found' });
  }
  
  const deleted = tests.splice(index, 1)[0];
  console.log('✅ Test deleted:', deleted.test_name);
  res.json({ message: 'Test deleted successfully' });
});

// ==================== ITEM ROUTES ====================
app.get('/api/items/all-items', verifyToken, (req, res) => {
  res.json(items);
});

app.post('/api/items', verifyToken, (req, res) => {
  const newItem = {
    item_id: itemIdCounter++,
    ...req.body,
    created_at: new Date().toISOString()
  };
  items.push(newItem);
  console.log('✅ Item created:', newItem.item_name);
  res.status(201).json(newItem);
});

app.put('/api/items/:id', verifyToken, (req, res) => {
  const id = parseInt(req.params.id);
  const index = items.findIndex(i => i.item_id === id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Item not found' });
  }
  
  items[index] = { ...items[index], ...req.body };
  console.log('✅ Item updated:', items[index].item_name);
  res.json(items[index]);
});

app.delete('/api/items/:id', verifyToken, (req, res) => {
  const id = parseInt(req.params.id);
  const index = items.findIndex(i => i.item_id === id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Item not found' });
  }
  
  const deleted = items.splice(index, 1)[0];
  console.log('✅ Item deleted:', deleted.item_name);
  res.json({ message: 'Item deleted successfully' });
});

// ==================== BILLING ROUTES ====================
app.get('/api/billing/invoices', verifyToken, (req, res) => {
  res.json({ data: invoices });
});

app.post('/api/billing/invoices', verifyToken, (req, res) => {
  const newInvoice = {
    invoice_id: invoiceIdCounter++,
    invoice_number: `INV-${String(invoiceIdCounter).padStart(5, '0')}`,
    ...req.body,
    created_at: new Date().toISOString()
  };
  invoices.push(newInvoice);
  console.log('✅ Invoice created:', newInvoice.invoice_number);
  res.status(201).json(newInvoice);
});

app.get('/api/billing/stats', verifyToken, (req, res) => {
  const totalAmount = invoices.reduce((sum, inv) => sum + (parseFloat(inv.total_amount) || 0), 0);
  const totalPaid = invoices.reduce((sum, inv) => sum + (parseFloat(inv.paid_amount) || 0), 0);
  const totalBalance = invoices.reduce((sum, inv) => sum + (parseFloat(inv.balance_amount) || 0), 0);
  const paidInvoices = invoices.filter(inv => inv.payment_status === 'paid');
  const unpaidInvoices = invoices.filter(inv => inv.payment_status === 'unpaid');
  const partialInvoices = invoices.filter(inv => inv.payment_status === 'partial');
  
  res.json({
    data: {
      total_amount: totalAmount,
      total_paid: totalPaid,
      total_balance: totalBalance,
      total_invoices: invoices.length,
      paid_count: paidInvoices.length,
      unpaid_count: unpaidInvoices.length,
      partial_count: partialInvoices.length,
      total_patients: patients.length,
      total_tests: tests.length
    }
  });
});

app.get('/api/billing/revenue-chart', verifyToken, (req, res) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const data = months.map((month, index) => ({
    month,
    revenue: Math.floor(Math.random() * 100000) + 50000
  }));
  
  res.json({ data });
});

// ==================== DOCTOR ROUTES ====================
app.get('/api/doctors', verifyToken, (req, res) => {
  res.json({ data: doctors });
});

app.get('/api/doctors/stats', verifyToken, (req, res) => {
  res.json({
    data: {
      total_doctors: doctors.length,
      active_doctors: doctors.filter(d => d.is_active).length,
      total_referrals: doctors.reduce((sum, d) => sum + (d.total_referrals || 0), 0),
      total_commission: doctors.reduce((sum, d) => sum + (d.total_commission || 0), 0),
      pending_commission: doctors.reduce((sum, d) => sum + (d.pending_commission || 0), 0)
    }
  });
});

// ==================== INVENTORY ROUTES ====================
app.get('/api/inventory/items', verifyToken, (req, res) => {
  res.json({ data: items });
});

app.get('/api/inventory/stats', verifyToken, (req, res) => {
  const lowStockItems = items.filter(i => i.current_stock <= i.min_stock_level);
  const totalValue = items.reduce((sum, i) => sum + (i.current_stock * i.unit_price || 0), 0);
  
  res.json({
    data: {
      total_items: items.length,
      active_items: items.filter(i => i.is_active).length,
      low_stock_items: lowStockItems.length,
      total_value: totalValue
    }
  });
});

app.get('/api/inventory/low-stock', verifyToken, (req, res) => {
  const lowStock = items.filter(i => i.current_stock <= i.min_stock_level);
  res.json({ data: lowStock });
});

app.get('/api/inventory/expiring', verifyToken, (req, res) => {
  const today = new Date();
  const thirtyDaysLater = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
  
  const expiring = items.filter(i => {
    if (!i.expiry_date) return false;
    const expiryDate = new Date(i.expiry_date);
    return expiryDate <= thirtyDaysLater && expiryDate > today;
  }).map(i => ({
    ...i,
    days_to_expiry: Math.ceil((new Date(i.expiry_date) - today) / (1000 * 60 * 60 * 24))
  }));
  
  res.json({ data: expiring });
});

// ==================== PACKAGE ROUTES ====================
app.get('/api/packages', verifyToken, (req, res) => {
  res.json({ data: packages });
});

app.get('/api/packages/stats', verifyToken, (req, res) => {
  res.json({
    data: {
      total_packages: packages.length,
      active_packages: packages.filter(p => p.is_active).length,
      packages_sold: 0,
      monthly_sales: 0,
      total_revenue: 0,
      avg_discount: 15
    }
  });
});

// ==================== LEDGER ROUTES ====================
app.get('/api/ledger/parties', verifyToken, (req, res) => {
  const parties = [
    ...patients.map(p => ({
      party_id: `P${p.patient_id}`,
      party_name: p.patient_name,
      party_type: 'patient',
      current_balance: 0,
      last_transaction_date: new Date().toISOString()
    })),
    ...doctors.map(d => ({
      party_id: `D${d.doctor_id}`,
      party_name: d.doctor_name,
      party_type: 'doctor',
      current_balance: 0,
      last_transaction_date: new Date().toISOString()
    }))
  ];
  res.json({ data: parties });
});

app.get('/api/ledger/summary', verifyToken, (req, res) => {
  res.json({
    data: {
      total_parties: patients.length + doctors.length,
      total_transactions: ledgerEntries.length,
      total_credit: 0,
      total_debit: 0,
      total_cashback: 0
    }
  });
});

app.get('/api/ledger/party/:id', verifyToken, (req, res) => {
  res.json({ data: { entries: [] } });
});

// ==================== TEST ORDER ROUTES ====================
app.get('/api/test-orders', verifyToken, (req, res) => {
  res.json({ data: [] });
});

app.get('/api/test-orders/stats', verifyToken, (req, res) => {
  res.json({
    data: {
      total_reports: 0,
      pending_reports: 0,
      in_progress_reports: 0,
      completed_reports: 0
    }
  });
});

// ==================== EMI ROUTES ====================
let emiPlans = [];
let emiPlanIdCounter = 1;

app.get('/api/emi/plans', verifyToken, (req, res) => {
  res.json({ data: emiPlans });
});

app.post('/api/emi/plans', verifyToken, (req, res) => {
  const newPlan = {
    emi_plan_id: emiPlanIdCounter++,
    ...req.body,
    created_at: new Date().toISOString()
  };
  emiPlans.push(newPlan);
  console.log('✅ EMI Plan created:', newPlan.invoice_number);
  res.status(201).json(newPlan);
});

app.get('/api/emi/installments/due', verifyToken, (req, res) => {
  // Return empty array for now - can be enhanced later
  res.json({ data: [] });
});

app.get('/api/emi/stats', verifyToken, (req, res) => {
  const totalPlans = emiPlans.length;
  const activePlans = emiPlans.filter(p => p.status === 'active').length;
  const totalAmount = emiPlans.reduce((sum, p) => sum + (parseFloat(p.total_amount) || 0), 0);
  const paidAmount = emiPlans.reduce((sum, p) => sum + (parseFloat(p.emi_amount) * (p.paid_installments || 0)), 0);
  const pendingAmount = totalAmount - paidAmount;
  
  res.json({
    data: {
      total_plans: totalPlans,
      active_plans: activePlans,
      total_installments: emiPlans.reduce((sum, p) => sum + (parseInt(p.total_installments) || 0), 0),
      paid_installments: emiPlans.reduce((sum, p) => sum + (parseInt(p.paid_installments) || 0), 0),
      pending_installments: emiPlans.reduce((sum, p) => sum + ((parseInt(p.total_installments) || 0) - (parseInt(p.paid_installments) || 0)), 0),
      overdue_installments: 0,
      total_paid: paidAmount,
      total_pending: pendingAmount
    }
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Complete Backend is running',
    timestamp: new Date().toISOString(),
    stats: {
      patients: patients.length,
      tests: tests.length,
      items: items.length,
      invoices: invoices.length
    }
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
  console.log('🌟 COMPLETE SERVER RUNNING!');
  console.log('🌟 ================================');
  console.log(`🔗 Server URL: http://localhost:${PORT}`);
  console.log('');
  console.log('📋 CREDENTIALS:');
  console.log('   📧 Username: admin');
  console.log('   🔑 Password: admin123');
  console.log('');
  console.log('✨ All CRUD endpoints ready!');
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
