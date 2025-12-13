const axios = require('axios');

async function testPatientAPI() {
  console.log('👥 ===== TESTING PATIENT API =====\n');

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

    // Test get all patients
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
      console.log('   ❌ Get patients error:', error.response?.data?.message || error.message);
    }

    // Test create patient
    console.log('\n3️⃣ Testing POST /api/patients/add-patients...');
    const testPatient = {
      patient_name: 'Test Patient API',
      phone: '9999999999',
      email: 'testapi@example.com',
      gender: 'male',
      age: 25,
      address: 'Test Address API',
      referred_by: 'API Test'
    };

    try {
      const createResponse = await axios.post(`${baseURL}/patients/add-patients`, testPatient, { headers });
      console.log('   ✅ Patient created successfully');
      console.log('   📋 Created patient:', createResponse.data);
      
      // Clean up - delete the test patient
      if (createResponse.data && createResponse.data.id) {
        try {
          await axios.delete(`${baseURL}/patients/patient/${createResponse.data.id}`, { headers });
          console.log('   🗑️ Test patient cleaned up');
        } catch (deleteError) {
          console.log('   ⚠️ Could not clean up test patient');
        }
      }
    } catch (error) {
      console.log('   ❌ Create patient error:', error.response?.data?.message || error.message);
      console.log('   📋 Error details:', error.response?.data);
    }

    console.log('\n✅ ===== PATIENT API TEST COMPLETE =====');
    console.log('\n📝 Summary:');
    console.log('   • Patient creation should now work');
    console.log('   • Try adding a patient from the frontend');

  } catch (error) {
    console.error('\n❌ Login error:', error.response?.data?.message || error.message);
    console.log('   ⚠️  Make sure backend is running on port 5000');
  }
}

testPatientAPI();