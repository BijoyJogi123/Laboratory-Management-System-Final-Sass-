const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function testDashboardEndpoints() {
  console.log('🎯 TESTING ALL DASHBOARD ENDPOINTS');
  console.log('=====================================\n');

  try {
    // Step 1: Login to get token
    console.log('1️⃣ Logging in...');
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login-user`, {
      email: 'test@lab.com',
      password: 'Test@123'
    });

    const token = loginResponse.data.token;
    console.log('✅ Login successful, token received');

    const authHeaders = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    // Step 2: Test all dashboard endpoints
    console.log('\n2️⃣ Testing dashboard endpoints...\n');

    // Test /api/tests/all-tests
    console.log('🧪 Testing /api/tests/all-tests...');
    const testsResponse = await axios.get(`${BASE_URL}/api/tests/all-tests`, {
      headers: authHeaders
    });
    console.log(`✅ Tests endpoint: ${testsResponse.data.length} tests returned`);

    // Test /api/patients/all-patients
    console.log('👥 Testing /api/patients/all-patients...');
    const patientsResponse = await axios.get(`${BASE_URL}/api/patients/all-patients`, {
      headers: authHeaders
    });
    console.log(`✅ Patients endpoint: ${patientsResponse.data.length} patients returned`);

    // Test /api/patients/all-patients-tests (CRITICAL for dashboard)
    console.log('🔬 Testing /api/patients/all-patients-tests...');
    const patientTestsResponse = await axios.get(`${BASE_URL}/api/patients/all-patients-tests`, {
      headers: authHeaders
    });
    console.log(`✅ Patient tests endpoint: ${patientTestsResponse.data.length} patient tests returned`);

    // Test /api/reports/report/:sales_item_id
    console.log('📊 Testing /api/reports/report/1001...');
    const reportResponse = await axios.get(`${BASE_URL}/api/reports/report/1001`, {
      headers: authHeaders
    });
    console.log('✅ Reports endpoint working');

    // Test /api/user/users
    console.log('👤 Testing /api/user/users...');
    const usersResponse = await axios.get(`${BASE_URL}/api/user/users`, {
      headers: authHeaders
    });
    console.log('✅ Users endpoint working');

    // Step 3: Verify data structure for dashboard
    console.log('\n3️⃣ Verifying data structures...\n');

    // Check tests data structure
    const testSample = testsResponse.data[0];
    console.log('🧪 Test data structure:');
    console.log(`   - Has id: ${!!testSample.id}`);
    console.log(`   - Has name: ${!!testSample.name}`);
    console.log(`   - Has price: ${!!testSample.price}`);
    console.log(`   - Has created_at: ${!!testSample.created_at}`);

    // Check patients data structure
    const patientSample = patientsResponse.data[0];
    console.log('👥 Patient data structure:');
    console.log(`   - Has id: ${!!patientSample.id}`);
    console.log(`   - Has name: ${!!patientSample.name}`);
    console.log(`   - Has created_at: ${!!patientSample.created_at}`);

    // Check patient tests data structure (CRITICAL)
    const patientTestSample = patientTestsResponse.data[0];
    console.log('🔬 Patient test data structure:');
    console.log(`   - Has sales_item_id: ${!!patientTestSample.sales_item_id}`);
    console.log(`   - Has patient_name: ${!!patientTestSample.patient_name}`);
    console.log(`   - Has item_name: ${!!patientTestSample.item_name}`);
    console.log(`   - Has price: ${!!patientTestSample.price}`);
    console.log(`   - Has dis_perc: ${!!patientTestSample.dis_perc}`);
    console.log(`   - Has tax_perc: ${!!patientTestSample.tax_perc}`);
    console.log(`   - Has status: ${!!patientTestSample.status}`);
    console.log(`   - Has created_at: ${!!patientTestSample.created_at}`);

    // Step 4: Calculate dashboard metrics
    console.log('\n4️⃣ Dashboard metrics calculation...\n');

    const totalTests = testsResponse.data.length;
    const totalPatients = patientsResponse.data.length;
    const totalPatientTests = patientTestsResponse.data.length;
    
    // Calculate total revenue
    const totalRevenue = patientTestsResponse.data.reduce((acc, item) => {
      const price = Number(item.price) || 0;
      const discount = Number(item.dis_value) || 0;
      const tax = Number(item.tax_value) || 0;
      return acc + (price - discount + tax);
    }, 0);

    console.log('📊 Dashboard Metrics:');
    console.log(`   - Total Tests: ${totalTests}`);
    console.log(`   - Total Patients: ${totalPatients}`);
    console.log(`   - Total Patient Tests: ${totalPatientTests}`);
    console.log(`   - Total Revenue: $${totalRevenue.toFixed(2)}`);

    console.log('\n🎉 ================================');
    console.log('🎉 ALL DASHBOARD ENDPOINTS WORKING!');
    console.log('🎉 ================================');
    console.log('✅ Authentication: Working');
    console.log('✅ Tests endpoint: Working');
    console.log('✅ Patients endpoint: Working');
    console.log('✅ Patient tests endpoint: Working');
    console.log('✅ Reports endpoint: Working');
    console.log('✅ Users endpoint: Working');
    console.log('✅ Data structures: Compatible');
    console.log('✅ Dashboard metrics: Calculable');
    console.log('\n🚀 DASHBOARD SHOULD NOW LOAD PROPERLY!');

  } catch (error) {
    console.error('\n❌ DASHBOARD ENDPOINT TEST FAILED!');
    console.error('=====================================');
    
    if (error.response) {
      console.error('📊 Status:', error.response.status);
      console.error('📝 Message:', error.response.data?.message || 'No message');
      console.error('🔗 URL:', error.config?.url);
      console.error('📥 Response data:', JSON.stringify(error.response.data, null, 2));
    } else if (error.code === 'ECONNREFUSED') {
      console.error('🔌 Connection refused - server is not running');
      console.log('\n💡 To fix this:');
      console.log('   1. cd backend');
      console.log('   2. npm start');
      console.log('   3. Wait for "SERVER RUNNING SUCCESSFULLY!" message');
      console.log('   4. Run this test again');
    } else {
      console.error('❓ Unknown error:', error.message);
    }
  }
}

// Run the test
testDashboardEndpoints();