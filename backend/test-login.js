const axios = require('axios');

console.log('🧪 Testing login endpoint...');

const testLogin = async () => {
  try {
    console.log('📡 Sending login request...');
    
    const response = await axios.post('http://localhost:5000/api/auth/login-user', {
      email: 'test@lab.com',
      password: 'Test@123'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Login successful!');
    console.log('🎫 Token received:', response.data.token ? 'Yes' : 'No');
    console.log('📊 Response:', response.data);
    
  } catch (error) {
    console.log('❌ Login failed!');
    console.log('📊 Status:', error.response?.status);
    console.log('📝 Message:', error.response?.data?.message);
    console.log('🔍 Full error:', error.response?.data);
  }
};

// Test health endpoint first
const testHealth = async () => {
  try {
    console.log('🏥 Testing health endpoint...');
    const response = await axios.get('http://localhost:5000/api/health');
    console.log('✅ Health check passed:', response.data.message);
    return true;
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
    return false;
  }
};

const runTests = async () => {
  const healthOk = await testHealth();
  if (healthOk) {
    await testLogin();
  } else {
    console.log('💡 Server might not be running. Start it with: npm start');
  }
};

runTests();