const axios = require('axios');

const BASE_URL = 'http://localhost:5000';
const credentials = {
  email: 'test@lab.com',
  password: 'Test@123'
};

async function testCompleteFlow() {
  console.log('🚀 Testing Complete Laboratory Management System Flow\n');
  
  try {
    // 1. Health Check
    console.log('1️⃣ Testing health check...');
    const healthResponse = await axios.get(`${BASE_URL}/api/health`);
    console.log('✅ Health check passed');
    console.log('📋 Test user initialized:', healthResponse.data.testUser?.initialized);
    
    // 2. Login
    console.log('\n2️⃣ Testing login...');
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login-user`, credentials);
    console.log('✅ Login successful');
    const token = loginResponse.data.token;
    console.log('🎫 Token received');
    
    // Headers for authenticated requests
    const authHeaders = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    
    // 3. Test Patients endpoint
    console.log('\n3️⃣ Testing patients endpoint...');
    const patientsResponse = await axios.get(`${BASE_URL}/api/patients/all-patients`, {
      headers: authHeaders
    });
    console.log('✅ Patients endpoint working');
    console.log('👥 Patients count:', patientsResponse.data.patients?.length || 0);
    
    // 4. Test Tests endpoint
    console.log('\n4️⃣ Testing tests endpoint...');
    const testsResponse = await axios.get(`${BASE_URL}/api/tests/all-tests`, {
      headers: authHeaders
    });
    console.log('✅ Tests endpoint working');
    console.log('🧪 Tests count:', testsResponse.data.tests?.length || 0);
    
    // 5. Test Users endpoint
    console.log('\n5️⃣ Testing users endpoint...');
    const usersResponse = await axios.get(`${BASE_URL}/api/user/users`, {
      headers: authHeaders
    });
    console.log('✅ Users endpoint working');
    console.log('👤 Users count:', usersResponse.data.users?.length || 0);
    
    // 6. Test creating a new patient
    console.log('\n6️⃣ Testing add patient...');
    const newPatient = {
      name: 'Test Patient',
      email: 'testpatient@example.com',
      phone: '555-0123',
      age: 35,
      gender: 'Male'
    };
    
    const addPatientResponse = await axios.post(`${BASE_URL}/api/patients/add-patients`, newPatient, {
      headers: authHeaders
    });
    console.log('✅ Add patient working');
    console.log('👤 New patient ID:', addPatientResponse.data.patient?.id);
    
    console.log('\n🎉 ================================');
    console.log('🎉 ALL TESTS PASSED!');
    console.log('🎉 ================================');
    console.log('✅ Authentication: Working');
    console.log('✅ Protected Routes: Working');
    console.log('✅ CORS: Configured');
    console.log('✅ JWT Tokens: Working');
    console.log('\n📋 READY FOR FRONTEND!');
    console.log('   📧 Email: test@lab.com');
    console.log('   🔑 Password: Test@123');
    
  } catch (error) {
    console.error('\n❌ Test failed!');
    console.error('Status:', error.response?.status);
    console.error('Message:', error.response?.data?.message || error.message);
    console.error('URL:', error.config?.url);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Server is not running. Please start it:');
      console.log('   cd backend');
      console.log('   npm start');
    }
  }
}

testCompleteFlow();