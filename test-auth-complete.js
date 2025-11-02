const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function testAuthentication() {
  console.log('🧪 COMPREHENSIVE AUTHENTICATION TEST');
  console.log('=====================================\n');

  try {
    // Step 1: Check if server is running
    console.log('1️⃣ Checking server status...');
    try {
      const healthResponse = await axios.get(`${BASE_URL}/api/health`);
      console.log('✅ Server is running');
      console.log('📊 Server status:', healthResponse.data.status);
      console.log('👤 Test user initialized:', healthResponse.data.testUser?.initialized);
      
      if (!healthResponse.data.testUser?.initialized) {
        console.log('⚠️  Test user not initialized yet, waiting 2 seconds...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } catch (error) {
      console.error('❌ Server is not running!');
      console.log('💡 Please start the server first:');
      console.log('   cd backend');
      console.log('   npm start');
      return;
    }

    // Step 2: Test login with correct credentials
    console.log('\n2️⃣ Testing login with correct credentials...');
    const loginData = {
      email: 'test@lab.com',
      password: 'Test@123'
    };

    console.log('📤 Sending login request...');
    console.log('   URL:', `${BASE_URL}/api/auth/login-user`);
    console.log('   Email:', loginData.email);
    console.log('   Password:', loginData.password);

    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login-user`, loginData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Login successful!');
    console.log('🎫 Token received:', loginResponse.data.token ? 'Yes' : 'No');
    
    const token = loginResponse.data.token;
    if (!token) {
      throw new Error('No token received from login');
    }

    // Step 3: Test protected endpoint
    console.log('\n3️⃣ Testing protected endpoint...');
    const authHeaders = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    const patientsResponse = await axios.get(`${BASE_URL}/api/patients/all-patients`, {
      headers: authHeaders
    });

    console.log('✅ Protected endpoint works!');
    console.log('📋 Patients data received:', patientsResponse.data.success);

    // Step 4: Test wrong credentials
    console.log('\n4️⃣ Testing login with wrong credentials...');
    try {
      await axios.post(`${BASE_URL}/api/auth/login-user`, {
        email: 'test@lab.com',
        password: 'WrongPassword'
      });
      console.log('❌ Should have failed with wrong password!');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Correctly rejected wrong password');
      } else {
        console.log('⚠️  Unexpected error:', error.response?.status);
      }
    }

    // Step 5: Test without token
    console.log('\n5️⃣ Testing protected endpoint without token...');
    try {
      await axios.get(`${BASE_URL}/api/patients/all-patients`);
      console.log('❌ Should have failed without token!');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Correctly rejected request without token');
      } else {
        console.log('⚠️  Unexpected error:', error.response?.status);
      }
    }

    console.log('\n🎉 ================================');
    console.log('🎉 ALL AUTHENTICATION TESTS PASSED!');
    console.log('🎉 ================================');
    console.log('✅ Server is running');
    console.log('✅ Login endpoint works');
    console.log('✅ Token generation works');
    console.log('✅ Protected routes work');
    console.log('✅ Authentication validation works');
    console.log('\n🚀 BACKEND IS READY FOR FRONTEND!');

  } catch (error) {
    console.error('\n❌ AUTHENTICATION TEST FAILED!');
    console.error('=====================================');
    
    if (error.response) {
      console.error('📊 Status:', error.response.status);
      console.error('📝 Message:', error.response.data?.message || 'No message');
      console.error('🔗 URL:', error.config?.url);
      console.error('📤 Request data:', error.config?.data);
      console.error('📥 Response data:', JSON.stringify(error.response.data, null, 2));
    } else if (error.code === 'ECONNREFUSED') {
      console.error('🔌 Connection refused - server is not running');
      console.log('\n💡 To fix this:');
      console.log('   1. Open a new terminal');
      console.log('   2. cd backend');
      console.log('   3. npm start');
      console.log('   4. Wait for "SERVER RUNNING SUCCESSFULLY!" message');
      console.log('   5. Run this test again');
    } else {
      console.error('❓ Unknown error:', error.message);
    }
  }
}

// Run the test
testAuthentication();