const axios = require('axios');

console.log('🧪 Testing Backend Connection...\n');

async function testBackend() {
  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing health endpoint...');
    const healthResponse = await axios.get('http://localhost:5000/api/health');
    console.log('✅ Health check passed:', healthResponse.data.message);
    console.log('');

    // Test 2: Login
    console.log('2️⃣ Testing login...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login-user', {
      email: 'admin',
      password: 'admin123'
    });
    const token = loginResponse.data.token;
    console.log('✅ Login successful, token received');
    console.log('');

    // Test 3: Get Patients
    console.log('3️⃣ Testing get patients...');
    const patientsResponse = await axios.get('http://localhost:5000/api/patients/all-patients', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Get patients successful');
    console.log('   Current patients:', patientsResponse.data.length);
    console.log('');

    // Test 4: Create Patient
    console.log('4️⃣ Testing create patient...');
    const newPatient = {
      patient_name: 'Test Patient',
      phone: '1234567890',
      email: 'test@example.com',
      gender: 'male',
      age: 25,
      address: 'Test Address'
    };
    const createResponse = await axios.post('http://localhost:5000/api/patients', newPatient, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Create patient successful');
    console.log('   Patient ID:', createResponse.data.patient_id);
    console.log('   Patient Name:', createResponse.data.patient_name);
    console.log('');

    // Test 5: Verify Patient Added
    console.log('5️⃣ Verifying patient was added...');
    const verifyResponse = await axios.get('http://localhost:5000/api/patients/all-patients', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Verification successful');
    console.log('   Total patients now:', verifyResponse.data.length);
    console.log('');

    console.log('🎉 ALL TESTS PASSED!');
    console.log('');
    console.log('Backend is working correctly.');
    console.log('If frontend still has issues, check:');
    console.log('1. Browser console for errors (F12)');
    console.log('2. Network tab to see if request is sent');
    console.log('3. CORS settings');
    console.log('4. Token in localStorage');

  } catch (error) {
    console.error('❌ TEST FAILED!');
    console.error('');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else if (error.request) {
      console.error('No response received. Is backend running?');
      console.error('Make sure to run: cd backend && node complete-server.js');
    } else {
      console.error('Error:', error.message);
    }
  }
}

testBackend();
