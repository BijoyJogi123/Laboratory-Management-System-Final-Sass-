const axios = require('axios');

async function testLogin() {
  console.log('🧪 Testing login functionality...');
  
  const loginData = {
    email: 'test@lab.com',
    password: 'Test@123'
  };
  
  try {
    console.log('📤 Sending login request to http://localhost:5000/api/auth/login-user');
    console.log('📧 Email:', loginData.email);
    console.log('🔑 Password:', loginData.password);
    
    const response = await axios.post('http://localhost:5000/api/auth/login-user', loginData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Login successful!');
    console.log('🎫 Token received:', response.data.token);
    
    // Test protected endpoint
    console.log('\n🔒 Testing protected endpoint...');
    const protectedResponse = await axios.get('http://localhost:5000/api/health', {
      headers: {
        'Authorization': `Bearer ${response.data.token}`
      }
    });
    
    console.log('✅ Protected endpoint works!');
    console.log('📋 Response:', protectedResponse.data);
    
  } catch (error) {
    console.error('❌ Login failed!');
    console.error('Status:', error.response?.status);
    console.error('Message:', error.response?.data?.message || error.message);
    console.error('Full error:', error.response?.data);
  }
}

// Test if server is running first
async function checkServer() {
  try {
    const response = await axios.get('http://localhost:5000/api/health');
    console.log('✅ Server is running');
    console.log('📋 Health check:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Server is not running or not accessible');
    console.error('Error:', error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Starting authentication test...\n');
  
  const serverRunning = await checkServer();
  if (!serverRunning) {
    console.log('\n💡 Please start the server first:');
    console.log('   cd backend');
    console.log('   npm start');
    return;
  }
  
  console.log('\n🔐 Testing login...');
  await testLogin();
}

main();