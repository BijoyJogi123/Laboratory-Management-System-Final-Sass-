const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
let authToken = '';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'cyan');
}

function logSection(message) {
  log(`\n${'='.repeat(60)}`, 'blue');
  log(`  ${message}`, 'blue');
  log(`${'='.repeat(60)}`, 'blue');
}

// Test 1: Health Check
async function testHealthCheck() {
  logSection('TEST 1: Health Check');
  try {
    const response = await axios.get(`${BASE_URL}/health`);
    logSuccess('Health check passed');
    logInfo(`Version: ${response.data.version}`);
    logInfo(`Modules: ${Object.keys(response.data.modules).length} available`);
    return true;
  } catch (error) {
    logError(`Health check failed: ${error.message}`);
    return false;
  }
}

// Test 2: Login
async function testLogin() {
  logSection('TEST 2: Login');
  try {
    const response = await axios.post(`${BASE_URL}/auth/login-user`, {
      email: 'test@lab.com',
      password: 'Test@123'
    });
    authToken = response.data.token;
    logSuccess('Login successful');
    logInfo(`Token: ${authToken.substring(0, 20)}...`);
    return true;
  } catch (error) {
    logError(`Login failed: ${error.message}`);
    return false;
  }
}

// Test 3: Create Invoice
async function testCreateInvoice() {
  logSection('TEST 3: Create Invoice');
  try {
    const invoiceData = {
      invoice_date: '2024-11-16',
      patient_name: 'Test Patient',
      patient_contact: '9876543210',
      patient_email: 'patient@test.com',
      patient_address: '123 Test Street',
      subtotal: 1000,
      discount_amount: 100,
      tax_amount: 45,
      total_amount: 945,
      balance_amount: 945,
      payment_type: 'full',
      notes: 'Test invoice',
      items: [
        {
          item_type: 'test',
          item_name: 'Blood Test',
          description: 'Complete Blood Count',
          quantity: 1,
          unit_price: 500,
          discount_percent: 10,
          discount_amount: 50,
          tax_percent: 5,
          tax_amount: 22.5,
          total_amount: 472.5
        },
        {
          item_type: 'test',
          item_name: 'Urine Test',
          description: 'Urinalysis',
          quantity: 1,
          unit_price: 500,
          discount_percent: 10,
          discount_amount: 50,
          tax_percent: 5,
          tax_amount: 22.5,
          total_amount: 472.5
        }
      ]
    };

    const response = await axios.post(`${BASE_URL}/billing/invoices`, invoiceData, {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    logSuccess('Invoice created successfully');
    logInfo(`Invoice ID: ${response.data.data.invoiceId}`);
    return response.data.data.invoiceId;
  } catch (error) {
    logError(`Create invoice failed: ${error.response?.data?.message || error.message}`);
    return null;
  }
}

// Test 4: Get All Invoices
async function testGetInvoices() {
  logSection('TEST 4: Get All Invoices');
  try {
    const response = await axios.get(`${BASE_URL}/billing/invoices`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    logSuccess('Invoices retrieved successfully');
    logInfo(`Total invoices: ${response.data.data.length}`);
    
    if (response.data.data.length > 0) {
      const invoice = response.data.data[0];
      logInfo(`First invoice: ${invoice.invoice_number} - ₹${invoice.total_amount}`);
    }
    
    return true;
  } catch (error) {
    logError(`Get invoices failed: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

// Test 5: Get Invoice Statistics
async function testInvoiceStats() {
  logSection('TEST 5: Invoice Statistics');
  try {
    const response = await axios.get(`${BASE_URL}/billing/invoices/stats`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    logSuccess('Invoice statistics retrieved');
    const stats = response.data.data;
    logInfo(`Total Invoices: ${stats.total_invoices}`);
    logInfo(`Total Amount: ₹${stats.total_amount}`);
    logInfo(`Paid: ${stats.paid_count}, Unpaid: ${stats.unpaid_count}`);
    return true;
  } catch (error) {
    logError(`Get stats failed: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

// Test 6: Create EMI Plan
async function testCreateEMIPlan(invoiceId) {
  logSection('TEST 6: Create EMI Plan');
  try {
    const emiData = {
      invoice_id: invoiceId || 1,
      total_amount: 10000,
      down_payment: 2000,
      number_of_installments: 8,
      frequency: 'monthly',
      interest_rate: 0,
      start_date: '2024-12-01'
    };

    const response = await axios.post(`${BASE_URL}/emi/plans`, emiData, {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    logSuccess('EMI plan created successfully');
    logInfo(`EMI Plan ID: ${response.data.data.emiPlanId}`);
    return response.data.data.emiPlanId;
  } catch (error) {
    logError(`Create EMI plan failed: ${error.response?.data?.message || error.message}`);
    return null;
  }
}

// Test 7: Get EMI Plans
async function testGetEMIPlans() {
  logSection('TEST 7: Get EMI Plans');
  try {
    const response = await axios.get(`${BASE_URL}/emi/plans`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    logSuccess('EMI plans retrieved successfully');
    logInfo(`Total EMI plans: ${response.data.data.length}`);
    
    if (response.data.data.length > 0) {
      const plan = response.data.data[0];
      logInfo(`First plan: ${plan.invoice_number} - ${plan.paid_installments}/${plan.total_installments} paid`);
    }
    
    return true;
  } catch (error) {
    logError(`Get EMI plans failed: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

// Test 8: Get EMI Statistics
async function testEMIStats() {
  logSection('TEST 8: EMI Statistics');
  try {
    const response = await axios.get(`${BASE_URL}/emi/stats`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    logSuccess('EMI statistics retrieved');
    const stats = response.data.data;
    logInfo(`Total Plans: ${stats.total_plans}`);
    logInfo(`Total Installments: ${stats.total_installments}`);
    logInfo(`Pending: ${stats.pending_installments}, Overdue: ${stats.overdue_installments}`);
    return true;
  } catch (error) {
    logError(`Get EMI stats failed: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

// Test 9: Create Package
async function testCreatePackage() {
  logSection('TEST 9: Create Package');
  try {
    const packageData = {
      package_name: 'Complete Health Checkup',
      package_code: 'CHC001',
      description: 'Comprehensive health screening package',
      category: 'Preventive',
      total_price: 5000,
      discounted_price: 4000,
      discount_percent: 20,
      test_ids: [1, 2]
    };

    const response = await axios.post(`${BASE_URL}/packages`, packageData, {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    logSuccess('Package created successfully');
    logInfo(`Package ID: ${response.data.data.packageId}`);
    return response.data.data.packageId;
  } catch (error) {
    logError(`Create package failed: ${error.response?.data?.message || error.message}`);
    return null;
  }
}

// Test 10: Get All Packages
async function testGetPackages() {
  logSection('TEST 10: Get All Packages');
  try {
    const response = await axios.get(`${BASE_URL}/packages`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    logSuccess('Packages retrieved successfully');
    logInfo(`Total packages: ${response.data.data.length}`);
    
    if (response.data.data.length > 0) {
      const pkg = response.data.data[0];
      logInfo(`First package: ${pkg.package_name} - ₹${pkg.discounted_price} (${pkg.test_count} tests)`);
    }
    
    return true;
  } catch (error) {
    logError(`Get packages failed: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

// Test 11: Add Ledger Entry
async function testAddLedgerEntry() {
  logSection('TEST 11: Add Ledger Entry');
  try {
    const ledgerData = {
      party_id: 1,
      party_name: 'Test Patient',
      party_type: 'patient',
      entry_date: '2024-11-16',
      voucher_type: 'invoice',
      voucher_number: 'INV-001',
      invoice_number: 'DL/DL/24-25/001',
      credit_amount: 1000,
      debit_amount: 0,
      description: 'Test invoice entry'
    };

    const response = await axios.post(`${BASE_URL}/ledger/entry`, ledgerData, {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    logSuccess('Ledger entry added successfully');
    logInfo(`Ledger ID: ${response.data.data.ledgerId}`);
    logInfo(`New Balance: ₹${response.data.data.newBalance}`);
    return true;
  } catch (error) {
    logError(`Add ledger entry failed: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

// Test 12: Get Ledger Summary
async function testLedgerSummary() {
  logSection('TEST 12: Ledger Summary');
  try {
    const response = await axios.get(`${BASE_URL}/ledger/summary`, {
      headers: { Authorization: `Bearer ${authToken}` },
      params: {
        from_date: '2024-01-01',
        to_date: '2024-12-31'
      }
    });

    logSuccess('Ledger summary retrieved');
    const summary = response.data.data;
    logInfo(`Total Parties: ${summary.total_parties}`);
    logInfo(`Total Credit: ₹${summary.total_credit}`);
    logInfo(`Total Debit: ₹${summary.total_debit}`);
    return true;
  } catch (error) {
    logError(`Get ledger summary failed: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  log('\n🧪 LABORATORY MANAGEMENT SYSTEM - API TESTS', 'yellow');
  log('Testing new billing, EMI, ledger, and package features\n', 'yellow');

  const results = {
    passed: 0,
    failed: 0,
    total: 12
  };

  // Run tests sequentially
  if (await testHealthCheck()) results.passed++; else results.failed++;
  if (await testLogin()) results.passed++; else results.failed++;
  
  const invoiceId = await testCreateInvoice();
  if (invoiceId) results.passed++; else results.failed++;
  
  if (await testGetInvoices()) results.passed++; else results.failed++;
  if (await testInvoiceStats()) results.passed++; else results.failed++;
  
  const emiPlanId = await testCreateEMIPlan(invoiceId);
  if (emiPlanId) results.passed++; else results.failed++;
  
  if (await testGetEMIPlans()) results.passed++; else results.failed++;
  if (await testEMIStats()) results.passed++; else results.failed++;
  
  const packageId = await testCreatePackage();
  if (packageId) results.passed++; else results.failed++;
  
  if (await testGetPackages()) results.passed++; else results.failed++;
  if (await testAddLedgerEntry()) results.passed++; else results.failed++;
  if (await testLedgerSummary()) results.passed++; else results.failed++;

  // Summary
  logSection('TEST SUMMARY');
  log(`Total Tests: ${results.total}`, 'cyan');
  log(`Passed: ${results.passed}`, 'green');
  log(`Failed: ${results.failed}`, 'red');
  log(`Success Rate: ${((results.passed / results.total) * 100).toFixed(1)}%`, 'yellow');

  if (results.failed === 0) {
    log('\n🎉 ALL TESTS PASSED! System is working correctly.', 'green');
  } else {
    log('\n⚠️  Some tests failed. Check the logs above for details.', 'red');
  }
}

// Run tests
runAllTests().catch(error => {
  logError(`Test suite failed: ${error.message}`);
  process.exit(1);
});
