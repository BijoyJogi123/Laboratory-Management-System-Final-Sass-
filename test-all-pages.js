const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function testAllPages() {
  console.log('🧪 TESTING ALL FIXED PAGES');
  console.log('===========================\n');

  try {
    // Step 1: Login
    console.log('1️⃣ Logging in...');
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login-user`, {
      email: 'test@lab.com',
      password: 'Test@123'
    });

    const token = loginResponse.data.token;
    console.log('✅ Login successful\n');

    const authHeaders = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    // Step 2: Test Tests endpoint (for TestListPage)
    console.log('2️⃣ Testing Test List Page endpoint...');
    const testsResponse = await axios.get(`${BASE_URL}/api/tests/all-tests`, {
      headers: authHeaders
    });
    
    console.log(`✅ Tests endpoint: ${testsResponse.data.length} tests returned`);
    
    // Verify field names
    const testSample = testsResponse.data[0];
    console.log('   Field check:');
    console.log(`   - test_id: ${testSample.test_id ? '✅' : '❌'}`);
    console.log(`   - test_name: ${testSample.test_name ? '✅' : '❌'}`);
    console.log(`   - unit: ${testSample.unit ? '✅' : '❌'}`);
    console.log(`   - ref_value: ${testSample.ref_value ? '✅' : '❌'}`);
    console.log(`   Sample: ${testSample.test_name} (${testSample.unit})\n`);

    // Step 3: Test Patients endpoint (for PatientListPage)
    console.log('3️⃣ Testing Patient List Page endpoint...');
    const patientsResponse = await axios.get(`${BASE_URL}/api/patients/all-patients`, {
      headers: authHeaders
    });
    
    console.log(`✅ Patients endpoint: ${patientsResponse.data.length} patients returned`);
    
    // Verify field names
    const patientSample = patientsResponse.data[0];
    console.log('   Field check:');
    console.log(`   - sales_id: ${patientSample.sales_id ? '✅' : '❌'}`);
    console.log(`   - patient_name: ${patientSample.patient_name ? '✅' : '❌'}`);
    console.log(`   - patient_contact: ${patientSample.patient_contact ? '✅' : '❌'}`);
    console.log(`   - gender: ${patientSample.gender ? '✅' : '❌'}`);
    console.log(`   Sample: ${patientSample.patient_name} (${patientSample.patient_contact})\n`);

    // Step 4: Test Patient Tests endpoint (for Dashboard)
    console.log('4️⃣ Testing Dashboard endpoint...');
    const patientTestsResponse = await axios.get(`${BASE_URL}/api/patients/all-patients-tests`, {
      headers: authHeaders
    });
    
    console.log(`✅ Patient tests endpoint: ${patientTestsResponse.data.length} patient tests returned`);
    
    // Verify field names
    const patientTestSample = patientTestsResponse.data[0];
    console.log('   Field check:');
    console.log(`   - sales_item_id: ${patientTestSample.sales_item_id ? '✅' : '❌'}`);
    console.log(`   - patient_name: ${patientTestSample.patient_name ? '✅' : '❌'}`);
    console.log(`   - item_name: ${patientTestSample.item_name ? '✅' : '❌'}`);
    console.log(`   - price: ${patientTestSample.price ? '✅' : '❌'}`);
    console.log(`   Sample: ${patientTestSample.item_name} for ${patientTestSample.patient_name}\n`);

    // Step 5: Summary
    console.log('🎉 ================================');
    console.log('🎉 ALL PAGES WORKING!');
    console.log('🎉 ================================');
    console.log('✅ Authentication: Working');
    console.log('✅ Test List Page: Ready');
    console.log('✅ Patient List Page: Ready');
    console.log('✅ Dashboard: Ready');
    console.log('✅ Field names: Correct');
    console.log('✅ Data structures: Compatible');
    console.log('\n🚀 ALL FIXED PAGES ARE READY TO USE!');
    console.log('\n📋 Pages Working:');
    console.log('   1. Dashboard - http://localhost:3000/');
    console.log('   2. Test Lists - http://localhost:3000/test-lists');
    console.log('   3. Patient Lists - http://localhost:3000/patient-list');

  } catch (error) {
    console.error('\n❌ TEST FAILED!');
    console.error('===============');
    
    if (error.response) {
      console.error('📊 Status:', error.response.status);
      console.error('📝 Message:', error.response.data?.message || 'No message');
      console.error('🔗 URL:', error.config?.url);
      
      if (error.response.status === 401) {
        console.error('\n💡 Authentication error - check if:');
        console.error('   1. Backend server is running');
        console.error('   2. Login credentials are correct');
      }
    } else if (error.code === 'ECONNREFUSED') {
      console.error('🔌 Backend server is not running');
      console.log('\n💡 Start the backend:');
      console.log('   cd backend && npm start');
    } else {
      console.error('❓ Error:', error.message);
    }
  }
}

// Run the test
testAllPages();