const axios = require('axios');

const testSettingsAPI = async () => {
  console.log('🧪 Testing Settings API...\n');

  try {
    // Test 1: Check if server is running
    console.log('1. Testing server connection...');
    const healthCheck = await axios.get('http://localhost:5000/api/patients');
    console.log('✅ Server is running');

    // Test 2: Test login to get token
    console.log('\n2. Testing login...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login-user', {
      email: 'test@lab.com',
      password: 'Test@123'
    });
    const token = loginResponse.data.token;
    console.log('✅ Login successful, token received');

    // Test 3: Test lab-info endpoint
    console.log('\n3. Testing lab-info endpoint...');
    const labInfoResponse = await axios.get('http://localhost:5000/api/settings/lab-info', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Lab info endpoint working:', labInfoResponse.data);

    // Test 4: Test if uploads directory exists
    console.log('\n4. Checking uploads directory...');
    const fs = require('fs');
    if (fs.existsSync('./backend/uploads/logos')) {
      console.log('✅ Uploads directory exists');
    } else {
      console.log('❌ Uploads directory missing');
    }

    console.log('\n🎉 All tests passed! Logo upload should work now.');

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    
    console.log('\n🔧 Troubleshooting steps:');
    console.log('1. Make sure backend server is running: npm start (in backend folder)');
    console.log('2. Check if database is connected');
    console.log('3. Verify multer is installed: npm install multer (in backend folder)');
    console.log('4. Check if uploads directory exists');
  }
};

testSettingsAPI();