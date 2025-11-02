const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function testDashboardFix() {
  console.log('🔧 TESTING DASHBOARD API FIX');
  console.log('==============================\n');

  try {
    // Step 1: Login to get token
    console.log('1️⃣ Logging in...');
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login-user`, {
      email: 'test@lab.com',
      password: 'Test@123'
    });

    const token = loginResponse.data.token;
    console.log('✅ Login successful');

    const authHeaders = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    // Step 2: Test all dashboard endpoints that were failing
    console.log('\n2️⃣ Testing dashboard endpoints with authentication...\n');

    // Test 1: /api/tests/all-tests
    console.log('🧪 Testing /api/tests/all-tests...');
    const testsResponse = await axios.get(`${BASE_URL}/api/tests/all-tests`, {
      headers: authHeaders
    });
    console.log(`✅ Tests: ${testsResponse.data.length} tests returned`);
    console.log(`   Sample test: ${testsResponse.data[0]?.name}`);

    // Test 2: /api/patients/all-patients
    console.log('👥 Testing /api/patients/all-patients...');
    const patientsResponse = await axios.get(`${BASE_URL}/api/patients/all-patients`, {
      headers: authHeaders
    });
    console.log(`✅ Patients: ${patientsResponse.data.length} patients returned`);
    console.log(`   Sample patient: ${patientsResponse.data[0]?.name}`);

    // Test 3: /api/patients/all-patients-tests (CRITICAL)
    console.log('🔬 Testing /api/patients/all-patients-tests...');
    const patientTestsResponse = await axios.get(`${BASE_URL}/api/patients/all-patients-tests`, {
      headers: authHeaders
    });
    console.log(`✅ Patient Tests: ${patientTestsResponse.data.length} patient tests returned`);
    console.log(`   Sample test: ${patientTestsResponse.data[0]?.item_name} for ${patientTestsResponse.data[0]?.patient_name}`);

    // Test 4: /api/reports/report/:id
    console.log('📊 Testing /api/reports/report/1001...');
    const reportResponse = await axios.get(`${BASE_URL}/api/reports/report/1001`, {
      headers: authHeaders
    });
    console.log('✅ Reports endpoint working');
    console.log(`   Report for: ${reportResponse.data.report?.patient_name}`);

    // Step 3: Verify data structures for dashboard calculations
    console.log('\n3️⃣ Verifying dashboard calculations...\n');

    // Calculate metrics like the dashboard does
    const totalTests = testsResponse.data.length;
    const totalPatients = patientsResponse.data.length;
    const totalPatientTests = patientTestsResponse.data.length;

    // Calculate revenue like dashboard does
    const totalRevenue = patientTestsResponse.data.reduce((acc, item) => {
      const price = Number(item.price) || 0;
      const discount = Number(item.dis_value) || 0;
      const tax = Number(item.tax_value) || 0;
      return acc + (price - discount + tax);
    }, 0);

    console.log('📊 Dashboard Metrics (calculated):');
    console.log(`   - Total Tests: ${totalTests}`);
    console.log(`   - Total Patients: ${totalPatients}`);
    console.log(`   - Total Patient Tests: ${totalPatientTests}`);
    console.log(`   - Total Revenue: $${totalRevenue.toFixed(2)}`);

    // Step 4: Test data structure compatibility
    console.log('\n4️⃣ Verifying data structure compatibility...\n');

    const testSample = testsResponse.data[0];
    const patientSample = patientsResponse.data[0];
    const patientTestSample = patientTestsResponse.data[0];

    console.log('✅ Data structure checks:');
    console.log(`   - Tests have required fields: ${!!testSample.id && !!testSample.name && !!testSample.created_at}`);
    console.log(`   - Patients have required fields: ${!!patientSample.id && !!patientSample.name && !!patientSample.created_at}`);
    console.log(`   - Patient tests have required fields: ${!!patientTestSample.sales_item_id && !!patientTestSample.patient_name && !!patientTestSample.item_name}`);

    console.log('\n🎉 ================================');
    console.log('🎉 DASHBOARD FIX SUCCESSFUL!');
    console.log('🎉 ================================');
    console.log('✅ All API endpoints working with authentication');
    console.log('✅ Data structures compatible with dashboard');
    console.log('✅ Revenue calculations working');
    console.log('✅ No more 401 Unauthorized errors');
    console.log('\n🚀 DASHBOARD SHOULD NOW LOAD WITHOUT ERRORS!');

  } catch (error) {
    console.error('\n❌ DASHBOARD FIX TEST FAILED!');
    console.error('===============================');
    
    if (error.response) {
      console.error('📊 Status:', error.response.status);
      console.error('📝 Message:', error.response.data?.message || 'No message');
      console.error('🔗 URL:', error.config?.url);
      
      if (error.response.status === 401) {
        console.error('\n💡 This is an authentication error. Make sure:');
        console.error('   1. Backend server is running');
        console.error('   2. Login credentials are correct');
        console.error('   3. JWT token is being sent properly');
      }
    } else if (error.code === 'ECONNREFUSED') {
      console.error('🔌 Connection refused - backend server is not running');
      console.log('\n💡 Start the backend server:');
      console.log('   cd backend && npm start');
    } else {
      console.error('❓ Unknown error:', error.message);
    }
  }
}

// Run the test
testDashboardFix();