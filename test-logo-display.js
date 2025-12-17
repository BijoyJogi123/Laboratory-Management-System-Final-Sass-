const axios = require('axios');

const testLogoDisplay = async () => {
  console.log('🧪 Testing Logo Display...\n');

  try {
    // Test login to get token
    console.log('1. Getting auth token...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login-user', {
      email: 'test@lab.com',
      password: 'Test@123'
    });
    const token = loginResponse.data.token;
    console.log('✅ Token received');

    // Test lab-info endpoint
    console.log('\n2. Fetching lab info...');
    const labInfoResponse = await axios.get('http://localhost:5000/api/settings/lab-info', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('Lab info response:', JSON.stringify(labInfoResponse.data, null, 2));
    
    if (labInfoResponse.data.logo_url) {
      console.log('\n✅ Logo URL found:', labInfoResponse.data.logo_url);
      console.log('🌐 Full URL should be: http://localhost:5000' + labInfoResponse.data.logo_url);
      
      // Test if logo file exists
      const fs = require('fs');
      const logoPath = './backend' + labInfoResponse.data.logo_url;
      if (fs.existsSync(logoPath)) {
        console.log('✅ Logo file exists on server');
      } else {
        console.log('❌ Logo file NOT found on server at:', logoPath);
      }
    } else {
      console.log('\n❌ No logo URL found in response');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
};

testLogoDisplay();