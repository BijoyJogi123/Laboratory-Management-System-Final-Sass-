const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
let authToken = '';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Login first
async function login() {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login-user`, {
      email: 'test@lab.com',
      password: 'Test@123'
    });
    authToken = response.data.token;
    log('✅ Login successful', 'green');
    return true;
  } catch (error) {
    log('❌ Login failed', 'red');
    return false;
  }
}

// Test Inventory Module
async function testInventory() {
  log('\n📦 Testing Inventory Module...', 'cyan');
  
  try {
    // Create item
    const itemData = {
      item_name: 'Blood Collection Tube',
      item_code: 'BCT001',
      category: 'consumable',
      unit: 'pieces',
      current_stock: 500,
      min_stock_level: 100,
      unit_price: 5.00,
      supplier_name: 'MedSupply Co'
    };

    const createResponse = await axios.post(`${BASE_URL}/inventory/items`, itemData, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    log(`✅ Created inventory item: ${createResponse.data.data.itemId}`, 'green');

    // Get all items
    const listResponse = await axios.get(`${BASE_URL}/inventory/items`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    log(`✅ Retrieved ${listResponse.data.data.length} inventory items`, 'green');

    // Get stats
    const statsResponse = await axios.get(`${BASE_URL}/inventory/stats`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    log(`✅ Inventory stats: ${statsResponse.data.data.total_items} total items`, 'green');

    return true;
  } catch (error) {
    log(`❌ Inventory test failed: ${error.response?.data?.message || error.message}`, 'red');
    return false;
  }
}

// Test Doctor Module
async function testDoctor() {
  log('\n👨‍⚕️ Testing Doctor Module...', 'cyan');
  
  try {
    // Create doctor
    const doctorData = {
      doctor_name: 'Dr. John Smith',
      specialization: 'Cardiology',
      qualification: 'MD, DM',
      registration_number: 'MCI12345',
      contact_number: '9876543210',
      email: 'dr.smith@example.com',
      commission_type: 'percentage',
      commission_value: 10
    };

    const createResponse = await axios.post(`${BASE_URL}/doctors`, doctorData, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    log(`✅ Created doctor: ${createResponse.data.data.doctorId}`, 'green');

    // Get all doctors
    const listResponse = await axios.get(`${BASE_URL}/doctors`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    log(`✅ Retrieved ${listResponse.data.data.length} doctors`, 'green');

    // Get stats
    const statsResponse = await axios.get(`${BASE_URL}/doctors/stats`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    log(`✅ Doctor stats: ${statsResponse.data.data.total_doctors} total doctors`, 'green');

    return true;
  } catch (error) {
    log(`❌ Doctor test failed: ${error.response?.data?.message || error.message}`, 'red');
    return false;
  }
}

// Run all tests
async function runTests() {
  log('🧪 Testing New Modules (Inventory & Doctor)', 'yellow');
  log('='.repeat(50), 'yellow');

  if (!await login()) {
    log('\n❌ Cannot proceed without login', 'red');
    return;
  }

  const inventoryResult = await testInventory();
  const doctorResult = await testDoctor();

  log('\n' + '='.repeat(50), 'yellow');
  log('📊 Test Summary:', 'yellow');
  log(`Inventory Module: ${inventoryResult ? '✅ PASSED' : '❌ FAILED'}`, inventoryResult ? 'green' : 'red');
  log(`Doctor Module: ${doctorResult ? '✅ PASSED' : '❌ FAILED'}`, doctorResult ? 'green' : 'red');

  if (inventoryResult && doctorResult) {
    log('\n🎉 All tests passed! New modules are working!', 'green');
  } else {
    log('\n⚠️  Some tests failed. Check the errors above.', 'red');
  }
}

runTests().catch(error => {
  log(`\n❌ Test suite failed: ${error.message}`, 'red');
  process.exit(1);
});
