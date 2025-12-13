const axios = require('axios');

async function testReportAPIs() {
  console.log('🧪 ===== TESTING REPORT GENERATION APIs =====\n');

  const baseURL = 'http://localhost:5000/api';
  
  // First, login to get token
  console.log('1️⃣ Logging in...');
  try {
    const loginResponse = await axios.post(`${baseURL}/auth/login-user`, {
      email: 'test@lab.com',
      password: 'Test@123'
    });
    
    const token = loginResponse.data.token;
    console.log('   ✅ Login successful');

    const headers = { Authorization: `Bearer ${token}` };

    // Test patients API
    console.log('\n2️⃣ Testing GET /api/patients/all-patients...');
    try {
      const patientsResponse = await axios.get(`${baseURL}/patients/all-patients`, { headers });
      console.log(`   ✅ Found ${patientsResponse.data.length} patients`);
      if (patientsResponse.data.length > 0) {
        console.log('   📋 Sample patient:', {
          id: patientsResponse.data[0].id,
          name: patientsResponse.data[0].patient_name,
          phone: patientsResponse.data[0].phone
        });
      }
    } catch (error) {
      console.log('   ❌ Patients API error:', error.response?.data?.message || error.message);
    }

    // Test doctors API
    console.log('\n3️⃣ Testing GET /api/doctors...');
    try {
      const doctorsResponse = await axios.get(`${baseURL}/doctors`, { headers });
      console.log(`   ✅ Found ${doctorsResponse.data.data?.length || 0} doctors`);
      if (doctorsResponse.data.data && doctorsResponse.data.data.length > 0) {
        console.log('   👨‍⚕️ Sample doctor:', {
          id: doctorsResponse.data.data[0].doctor_id,
          name: doctorsResponse.data.data[0].doctor_name,
          specialization: doctorsResponse.data.data[0].specialization
        });
      }
    } catch (error) {
      console.log('   ❌ Doctors API error:', error.response?.data?.message || error.message);
    }

    // Test tests API
    console.log('\n4️⃣ Testing GET /api/tests/all-tests...');
    try {
      const testsResponse = await axios.get(`${baseURL}/tests/all-tests`, { headers });
      console.log(`   ✅ Found ${testsResponse.data.length} tests`);
      if (testsResponse.data.length > 0) {
        console.log('   🧪 Sample test:', {
          id: testsResponse.data[0].test_id,
          name: testsResponse.data[0].test_name,
          type: testsResponse.data[0].test_type
        });
      }
    } catch (error) {
      console.log('   ❌ Tests API error:', error.response?.data?.message || error.message);
    }

    // Test reports API
    console.log('\n5️⃣ Testing GET /api/reports...');
    try {
      const reportsResponse = await axios.get(`${baseURL}/reports`, { headers });
      console.log(`   ✅ Found ${reportsResponse.data.data?.length || 0} reports`);
    } catch (error) {
      console.log('   ❌ Reports API error:', error.response?.data?.message || error.message);
    }

    console.log('\n✅ ===== API TESTING COMPLETE =====');
    console.log('\n📝 Summary:');
    console.log('   • All APIs should be working now');
    console.log('   • Check browser console for detailed logs');
    console.log('   • Try generating a report again');

  } catch (error) {
    console.error('\n❌ Login error:', error.response?.data?.message || error.message);
    console.log('   ⚠️  Make sure backend is running on port 5000');
  }
}

testReportAPIs();