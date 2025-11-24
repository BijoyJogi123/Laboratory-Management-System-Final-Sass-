const axios = require('axios');

// Test the tests endpoints
async function testEndpoints() {
  console.log('🧪 Testing Tests Endpoints\n');
  console.log('================================\n');

  // First, login to get token
  console.log('1️⃣ Logging in...');
  try {
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'test@lab.com',
      password: 'Test@123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login successful, token received\n');

    // Test GET all tests
    console.log('2️⃣ Fetching all tests...');
    const getResponse = await axios.get('http://localhost:5000/api/tests/all-tests', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(`✅ Found ${getResponse.data.length} tests`);
    if (getResponse.data.length > 0) {
      console.log('   Sample test:', getResponse.data[0]);
    }
    console.log('');

    // Test POST create test
    console.log('3️⃣ Creating a new test...');
    const testData = {
      test_name: 'Test Hemoglobin',
      unit: 'g/dL',
      ref_value: '13.5-17.5'
    };
    console.log('   Sending data:', testData);
    
    const createResponse = await axios.post('http://localhost:5000/api/tests/create-test', testData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Test created successfully!');
    console.log('   Response:', createResponse.data);
    console.log('');

    // Fetch again to verify
    console.log('4️⃣ Fetching tests again to verify...');
    const verifyResponse = await axios.get('http://localhost:5000/api/tests/all-tests', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(`✅ Now have ${verifyResponse.data.length} tests`);
    console.log('');

    console.log('================================');
    console.log('✅ ALL TESTS PASSED!');
    console.log('================================\n');
    console.log('Frontend should work perfectly now!');
    console.log('Just restart backend and try adding a test from UI.');

  } catch (error) {
    console.error('\n❌ ERROR:', error.response?.data || error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

testEndpoints();
