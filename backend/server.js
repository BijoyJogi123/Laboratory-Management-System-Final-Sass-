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
    endpoints: {
      // Authentication
      login: 'POST /api/auth/login-user',
      health: 'GET /api/health',
      
      // Patients (Protected)
      getAllPatients: 'GET /api/patients/all-patients',
      addPatient: 'POST /api/patients/add-patients',
      
      // Tests (Protected)
      getAllTests: 'GET /api/tests/all-tests',
      createTest: 'POST /api/tests/create-test',
      
      // Reports (Protected)
      getReport: 'GET /api/reports/report/:sales_item_id',
      submitReport: 'POST /api/reports/submit',
      
      // Users (Protected)
      getUsers: 'GET /api/user/users'
    }
  });
});

// Protected routes for the laboratory system

// Patients endpoints
app.get('/api/patients/all-patients', verifyToken, (req, res) => {
  console.log('📋 Fetching all patients for user:', req.user.email);
  
  // Sample patients data with correct field names for frontend compatibility
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
    },
    {
      id: 3,
      sales_id: 1003,
      patient_name: 'Mike Johnson',
      patient_contact: '555-123-4567',
      patient_type: 'OPD',
      addm_id: null,
      prn_id: 'PRN003',
      age: 35,
      gender: 'Male',
      ref_doctor: 'Dr. Williams',
      email: 'mike@example.com',
      created_at: '2024-03-10T09:45:00Z'
    },
    {
      id: 4,
      sales_id: 1004,
      patient_name: 'Sarah Wilson',
      patient_contact: '444-987-6543',
      patient_type: 'OPD',
      addm_id: 'ADM004',
      prn_id: 'PRN004',
      age: 28,
      gender: 'Female',
      ref_doctor: 'Dr. Brown',
      email: 'sarah@example.com',
      created_at: '2024-04-05T16:20:00Z'
    }
  ];
  
  // Return as array for dashboard compatibility
  res.json(patients);
});

// Patient tests endpoint - CRITICAL for dashboard
app.get('/api/patients/all-patients-tests', verifyToken, (req, res) => {
  console.log('🧪 Fetching all patient tests for user:', req.user.email);
  
  // Sample patient tests data for dashboard
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
    },
    {
      sales_item_id: 1003,
      patient_name: 'Mike Johnson',
      item_name: 'X-Ray',
      price: 200.00,
      dis_perc: 0,
      dis_value: 0.00,
      tax_perc: 8,
      tax_value: 16.00,
      status: 'Sample Received',
      created_at: '2024-11-02T09:45:00Z'
    },
    {
      sales_item_id: 1004,
      patient_name: 'Sarah Wilson',
      item_name: 'MRI Scan',
      price: 500.00,
      dis_perc: 15,
      dis_value: 75.00,
      tax_perc: 10,
      tax_value: 50.00,
      status: 'Report Generated',
      created_at: '2024-11-02T16:20:00Z'
    }
  ];
  
  // Return as array for dashboard compatibility
  res.json(patientTests);
});

// Patient tests endpoint - this was missing!
app.get('/api/patients/all-patients-tests', verifyToken, (req, res) => {
  console.log('🧪 Fetching all patient tests for user:', req.user.email);
  res.json({ 
    success: true,
    message: 'Patient tests retrieved successfully',
    patientTests: [
      {
        id: 1,
        patient_id: 1,
        patient_name: 'John Doe',
        test_id: 1,
        test_name: 'Blood Test',
        status: 'Completed',
        result: 'Normal',
        test_date: new Date().toISOString(),
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        patient_id: 2,
        patient_name: 'Jane Smith',
        test_id: 2,
        test_name: 'Urine Test',
        status: 'Pending',
        result: null,
        test_date: new Date().toISOString(),
        created_at: new Date().toISOString()
      },
      {
        id: 3,
        patient_id: 1,
        patient_name: 'John Doe',
        test_id: 2,
        test_name: 'Urine Test',
        status: 'In Progress',
        result: null,
        test_date: new Date().toISOString(),
        created_at: new Date().toISOString()
      }
    ],
    user: req.user
  });
});

// Individual patient endpoint
app.get('/api/patients/patient/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  console.log('👤 Fetching patient:', id);
  res.json({ 
    success: true,
    message: 'Patient retrieved successfully',
    patient: {
      id: parseInt(id),
      name: 'John Doe',
      email: 'john@example.com',
      phone: '123-456-7890',
      age: 30,
      gender: 'Male',
      address: '123 Main St, City, State',
      created_at: new Date().toISOString()
    }
  });
});

// Specific patient details
app.get('/api/patients/specific-patient/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  console.log('🔍 Fetching specific patient details:', id);
  res.json({ 
    success: true,
    message: 'Specific patient details retrieved successfully',
    patient: {
      id: parseInt(id),
      name: 'John Doe',
      email: 'john@example.com',
      phone: '123-456-7890',
      age: 30,
      gender: 'Male',
      address: '123 Main St, City, State',
      emergency_contact: 'Jane Doe - 098-765-4321',
      medical_history: 'No known allergies',
      created_at: new Date().toISOString()
    }
  });
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

// Update patient
app.put('/api/patients/patient/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  console.log('✏️ Updating patient:', id, req.body);
  res.json({ 
    success: true,
    message: 'Patient updated successfully',
    patient: {
      id: parseInt(id),
      ...req.body,
      updated_at: new Date().toISOString()
    }
  });
});

// Update patient sales
app.put('/api/patients/patient/sales/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  console.log('💰 Updating patient sales:', id, req.body);
  res.json({ 
    success: true,
    message: 'Patient sales updated successfully',
    sales: {
      id: parseInt(id),
      ...req.body,
      updated_at: new Date().toISOString()
    }
  });
});

// Delete patient
app.delete('/api/patients/patient/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  console.log('🗑️ Deleting patient:', id);
  res.json({ 
    success: true,
    message: 'Patient deleted successfully',
    deleted_id: parseInt(id)
  });
});

// Tests endpoints
app.get('/api/tests/all-tests', verifyToken, (req, res) => {
  console.log('🧪 Fetching all tests for user:', req.user.email);
  
  // Sample tests data with correct field names for frontend compatibility
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
    },
    {
      test_id: 3,
      test_name: 'X-Ray',
      unit: 'Image',
      ref_value: 'Normal',
      description: 'Chest X-Ray',
      price: 200.00,
      category: 'Radiology',
      created_at: '2024-02-01T10:15:00Z'
    },
    {
      test_id: 4,
      test_name: 'MRI Scan',
      unit: 'Image',
      ref_value: 'Normal',
      description: 'Magnetic Resonance Imaging',
      price: 500.00,
      category: 'Radiology',
      created_at: '2024-02-10T14:45:00Z'
    },
    {
      test_id: 5,
      test_name: 'ECG',
      unit: 'bpm',
      ref_value: '60-100',
      description: 'Electrocardiogram',
      price: 120.00,
      category: 'Cardiology',
      created_at: '2024-03-01T11:20:00Z'
    }
  ];
  
  // Return as array for frontend compatibility
  res.json(tests);
});

// All test items
app.get('/api/tests/all-items', verifyToken, (req, res) => {
  console.log('📋 Fetching all test items for user:', req.user.email);
  
  // Return items as array with correct field names for frontend
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
    },
    {
      item_id: 2,
      test_id: 1,
      item_name: 'White Blood Cell Count',
      ref_value: '4000-11000',
      unit: '/μL',
      price: 45.00,
      related_test: '1',
      normal_range: '4000-11000 /μL',
      created_at: '2024-01-10T08:00:00Z'
    },
    {
      item_id: 3,
      test_id: 2,
      item_name: 'Urine Protein Test',
      ref_value: 'Negative',
      unit: 'mg/dL',
      price: 30.00,
      related_test: '2',
      normal_range: 'Negative',
      created_at: '2024-01-15T09:30:00Z'
    },
    {
      item_id: 4,
      test_id: 2,
      item_name: 'Urine Glucose Test',
      ref_value: '70-110',
      unit: 'mg/dL',
      price: 35.00,
      related_test: '2',
      normal_range: '70-110 mg/dL',
      created_at: '2024-01-15T09:30:00Z'
    },
    {
      item_id: 5,
      test_id: 3,
      item_name: 'Chest X-Ray Imaging',
      ref_value: 'Normal',
      unit: 'Image',
      price: 200.00,
      related_test: '3',
      normal_range: 'Normal',
      created_at: '2024-02-01T10:15:00Z'
    },
    {
      item_id: 6,
      test_id: 4,
      item_name: 'MRI Brain Scan',
      ref_value: 'Normal',
      unit: 'Image',
      price: 500.00,
      related_test: '4',
      normal_range: 'Normal',
      created_at: '2024-02-10T14:45:00Z'
    },
    {
      item_id: 7,
      test_id: 5,
      item_name: 'ECG 12-Lead',
      ref_value: '60-100',
      unit: 'bpm',
      price: 120.00,
      related_test: '5',
      normal_range: '60-100 bpm',
      created_at: '2024-03-01T11:20:00Z'
    }
  ];
  
  res.json(items);
});

// Individual test
app.get('/api/tests/test/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  console.log('🔬 Fetching test:', id);
  res.json({ 
    success: true,
    message: 'Test retrieved successfully',
    test: {
      id: parseInt(id),
      name: 'Blood Test',
      description: 'Complete Blood Count',
      price: 50.00,
      category: 'Hematology',
      items: [
        { id: 1, name: 'Hemoglobin', normal_range: '12-16 g/dL' },
        { id: 2, name: 'White Blood Cells', normal_range: '4000-11000 /μL' }
      ],
      created_at: new Date().toISOString()
    }
  });
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

// Create test item
app.post('/api/tests/create-item', verifyToken, (req, res) => {
  console.log('➕ Creating new test item:', req.body);
  res.json({ 
    success: true,
    message: 'Test item created successfully',
    item: {
      id: Date.now(),
      ...req.body,
      created_at: new Date().toISOString()
    }
  });
});

// Update test
app.put('/api/tests/test/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  console.log('✏️ Updating test:', id, req.body);
  res.json({ 
    success: true,
    message: 'Test updated successfully',
    test: {
      id: parseInt(id),
      ...req.body,
      updated_at: new Date().toISOString()
    }
  });
});

// Update test item
app.put('/api/tests/item/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  console.log('✏️ Updating test item:', id, req.body);
  res.json({ 
    success: true,
    message: 'Test item updated successfully',
    item: {
      id: parseInt(id),
      ...req.body,
      updated_at: new Date().toISOString()
    }
  });
});

// Delete test
app.delete('/api/tests/test/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  console.log('🗑️ Deleting test:', id);
  res.json({ 
    success: true,
    message: 'Test deleted successfully',
    deleted_id: parseInt(id)
  });
});

// Delete test item
app.delete('/api/tests/item/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  console.log('🗑️ Deleting test item:', id);
  res.json({ 
    success: true,
    message: 'Test item deleted successfully',
    deleted_id: parseInt(id)
  });
});

// Reports endpoints
app.get('/api/reports/report/:sales_item_id', verifyToken, (req, res) => {
  const { sales_item_id } = req.params;
  console.log('📊 Fetching report for sales item:', sales_item_id);
  res.json({ 
    success: true,
    message: 'Report retrieved successfully',
    report: {
      id: sales_item_id,
      patient_name: 'John Doe',
      test_name: 'Blood Test',
      results: 'Normal',
      status: 'Completed',
      created_at: new Date().toISOString()
    }
  });
});

app.post('/api/reports/submit', verifyToken, (req, res) => {
  console.log('📝 Submitting report:', req.body);
  res.json({ 
    success: true,
    message: 'Report submitted successfully',
    report: {
      id: Date.now(),
      ...req.body,
      created_at: new Date().toISOString()
    }
  });
});

// Reports - Fetch tests by IDs
app.post('/api/reports/tests/fetch', verifyToken, (req, res) => {
  console.log('🔍 Fetching tests by IDs:', req.body);
  const { testIds } = req.body;

  // Sample test items data
  const allTestItems = [
    { item_id: 1, test_id: 1, item_name: 'Hemoglobin Test', ref_value: '12-16', unit: 'g/dL', results: '' },
    { item_id: 2, test_id: 1, item_name: 'WBC Count', ref_value: '4000-11000', unit: '/μL', results: '' },
    { item_id: 3, test_id: 2, item_name: 'Urine Protein', ref_value: 'Negative', unit: 'mg/dL', results: '' }
  ];

  // Filter items based on testIds
  const filteredItems = testIds ? allTestItems.filter(item => testIds.includes(item.test_id)) : allTestItems;

  res.json(filteredItems);
});

// Items endpoint (alias for test items)
app.get('/api/items/all-items', verifyToken, (req, res) => {
  console.log('📋 Fetching all items for user:', req.user.email);
  res.json([
    { item_id: 1, test_id: 1, item_name: 'Hemoglobin Test', ref_value: '12-16', unit: 'g/dL', price: 50.00 },
    { item_id: 2, test_id: 1, item_name: 'WBC Count', ref_value: '4000-11000', unit: '/μL', price: 45.00 },
    { item_id: 3, test_id: 2, item_name: 'Urine Protein', ref_value: 'Negative', unit: 'mg/dL', price: 30.00 }
  ]);
});

// Billing endpoints
app.get('/api/billing/invoices', verifyToken, (req, res) => {
  console.log('💰 Fetching invoices for user:', req.user.email);
  res.json({
    success: true,
    data: [
      {
        invoice_id: 1,
        invoice_number: 'INV001',
        patient_name: 'John Doe',
        total_amount: 1000.00,
        paid_amount: 500.00,
        balance_amount: 500.00,
        payment_status: 'partial',
        invoice_date: new Date().toISOString()
      }
    ],
    count: 1
  });
});

app.get('/api/billing/invoices/stats', verifyToken, (req, res) => {
  console.log('📊 Fetching invoice stats');
  res.json({
    success: true,
    data: {
      total_invoices: 10,
      total_amount: 10000.00,
      total_paid: 6000.00,
      total_pending: 4000.00
    }
  });
});

app.get('/api/billing/stats', verifyToken, (req, res) => {
  console.log('📊 Fetching billing stats');
  res.json({
    success: true,
    data: {
      total_revenue: 10000.00,
      pending_payments: 4000.00,
      completed_payments: 6000.00
    }
  });
});

// EMI endpoints
app.get('/api/emi/plans', verifyToken, (req, res) => {
  console.log('💳 Fetching EMI plans');
  res.json({
    success: true,
    data: [
      {
        emi_plan_id: 1,
        patient_name: 'Jane Smith',
        total_amount: 5000.00,
        emi_amount: 500.00,
        status: 'active'
      }
    ]
  });
});

app.get('/api/emi/installments/due', verifyToken, (req, res) => {
  console.log('📅 Fetching due installments');
  res.json({
    success: true,
    data: [
      {
        installment_id: 1,
        patient_name: 'Jane Smith',
        amount: 500.00,
        due_date: new Date().toISOString()
      }
    ]
  });
});

app.get('/api/emi/stats', verifyToken, (req, res) => {
  console.log('📊 Fetching EMI stats');
  res.json({
    success: true,
    data: {
      total_plans: 5,
      total_installments: 50,
      pending_installments: 20,
      total_amount: 50000.00
    }
  });
});

// Ledger endpoints
app.get('/api/ledger/parties', verifyToken, (req, res) => {
  console.log('📒 Fetching ledger parties');
  res.json({
    success: true,
    data: [
      { party_id: 1, party_name: 'John Doe', balance: -1000.00 },
      { party_id: 2, party_name: 'Jane Smith', balance: 500.00 }
    ]
  });
});

app.get('/api/ledger/party/:partyId', verifyToken, (req, res) => {
  const { partyId } = req.params;
  console.log('📖 Fetching ledger for party:', partyId);
  res.json({
    success: true,
    data: {
      party_name: 'John Doe',
      opening_balance: 0,
      closing_balance: -1000.00,
      entries: []
    }
  });
});

app.get('/api/ledger/summary', verifyToken, (req, res) => {
  console.log('📊 Fetching ledger summary');
  res.json({
    success: true,
    data: {
      total_debit: 10000.00,
      total_credit: 8000.00,
      net_balance: 2000.00
    }
  });
});

// Packages endpoints
app.get('/api/packages', verifyToken, (req, res) => {
  console.log('📦 Fetching packages');
  res.json({
    success: true,
    data: [
      {
        package_id: 1,
        package_name: 'Complete Health Checkup',
        total_price: 2000.00,
        discounted_price: 1500.00,
        test_count: 10
      }
    ]
  });
});

app.get('/api/packages/stats', verifyToken, (req, res) => {
  console.log('📊 Fetching package stats');
  res.json({
    success: true,
    data: {
      total_packages: 5,
      active_packages: 4
    }
  });
});

// Doctors endpoints
app.get('/api/doctors', verifyToken, (req, res) => {
  console.log('👨‍⚕️ Fetching doctors');
  res.json({
    success: true,
    data: [
      {
        doctor_id: 1,
        doctor_name: 'Dr. Smith',
        specialization: 'Cardiology',
        contact_number: '1234567890'
      },
      {
        doctor_id: 2,
        doctor_name: 'Dr. Johnson',
        specialization: 'Neurology',
        contact_number: '0987654321'
      }
    ]
  });
});

app.get('/api/doctors/stats', verifyToken, (req, res) => {
  console.log('📊 Fetching doctor stats');
  res.json({
    success: true,
    data: {
      total_doctors: 10,
      active_doctors: 8
    }
  });
});

// Test Orders endpoints
app.get('/api/test-orders', verifyToken, (req, res) => {
  console.log('🧪 Fetching test orders');
  res.json({
    success: true,
    data: [
      {
        order_id: 1,
        patient_name: 'John Doe',
        test_name: 'Blood Test',
        status: 'pending',
        order_date: new Date().toISOString()
      }
    ]
  });
});

app.get('/api/test-orders/stats', verifyToken, (req, res) => {
  console.log('📊 Fetching test order stats');
  res.json({
    success: true,
    data: {
      total_orders: 100,
      pending_orders: 20,
      completed_orders: 80
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





