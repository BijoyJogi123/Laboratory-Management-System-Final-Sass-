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
  
  // Sample patients data for dashboard - return as array
  const patients = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '123-456-7890',
      age: 30,
      gender: 'Male',
      created_at: '2024-01-15T10:30:00Z'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '098-765-4321',
      age: 25,
      gender: 'Female',
      created_at: '2024-02-20T14:15:00Z'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike@example.com',
      phone: '555-123-4567',
      age: 35,
      gender: 'Male',
      created_at: '2024-03-10T09:45:00Z'
    },
    {
      id: 4,
      name: 'Sarah Wilson',
      email: 'sarah@example.com',
      phone: '444-987-6543',
      age: 28,
      gender: 'Female',
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
  
  // Sample tests data for dashboard - return as array
  const tests = [
    {
      id: 1,
      name: 'Blood Test',
      description: 'Complete Blood Count',
      price: 150.00,
      category: 'Hematology',
      created_at: '2024-01-10T08:00:00Z'
    },
    {
      id: 2,
      name: 'Urine Test',
      description: 'Urinalysis',
      price: 80.00,
      category: 'Clinical Chemistry',
      created_at: '2024-01-15T09:30:00Z'
    },
    {
      id: 3,
      name: 'X-Ray',
      description: 'Chest X-Ray',
      price: 200.00,
      category: 'Radiology',
      created_at: '2024-02-01T10:15:00Z'
    },
    {
      id: 4,
      name: 'MRI Scan',
      description: 'Magnetic Resonance Imaging',
      price: 500.00,
      category: 'Radiology',
      created_at: '2024-02-10T14:45:00Z'
    },
    {
      id: 5,
      name: 'ECG',
      description: 'Electrocardiogram',
      price: 120.00,
      category: 'Cardiology',
      created_at: '2024-03-01T11:20:00Z'
    }
  ];
  
  // Return as array for dashboard compatibility
  res.json(tests);
});

// All test items
app.get('/api/tests/all-items', verifyToken, (req, res) => {
  console.log('📋 Fetching all test items for user:', req.user.email);
  res.json({ 
    success: true,
    message: 'Test items retrieved successfully',
    items: [
      {
        id: 1,
        test_id: 1,
        item_name: 'Hemoglobin',
        normal_range: '12-16 g/dL',
        unit: 'g/dL',
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        test_id: 1,
        item_name: 'White Blood Cells',
        normal_range: '4000-11000 /μL',
        unit: '/μL',
        created_at: new Date().toISOString()
      },
      {
        id: 3,
        test_id: 2,
        item_name: 'Protein',
        normal_range: 'Negative',
        unit: 'mg/dL',
        created_at: new Date().toISOString()
      }
    ],
    user: req.user
  });
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





