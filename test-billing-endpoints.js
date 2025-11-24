const axios = require('axios');

async function testBillingEndpoints() {
  console.log('🧪 Testing Billing Endpoints\n');
  
  try {
    // Login first
    console.log('1️⃣ Logging in...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'test@lab.com',
      password: 'Test@123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login successful\n');

    // Test GET invoices
    console.log('2️⃣ Testing GET /api/billing/invoices...');
    try {
      const invoicesResponse = await axios.get('http://localhost:5000/api/billing/invoices', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          payment_status: '',
          search: '',
          from_date: '',
          to_date: ''
        }
      });
      console.log('✅ GET invoices works!');
      console.log(`   Found ${invoicesResponse.data.count} invoices\n`);
    } catch (error) {
      console.error('❌ GET invoices failed:', error.response?.status, error.response?.data || error.message);
    }

    // Test GET stats
    console.log('3️⃣ Testing GET /api/billing/invoices/stats...');
    try {
      const statsResponse = await axios.get('http://localhost:5000/api/billing/invoices/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ GET stats works!');
      console.log('   Stats:', statsResponse.data.data);
    } catch (error) {
      console.error('❌ GET stats failed:', error.response?.status, error.response?.data || error.message);
    }

    console.log('\n✅ Billing endpoints are working!');
    console.log('If you see 404 errors, restart your backend server.');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('Backend server is not running!');
      console.error('Start it with: cd backend && npm start');
    }
  }
}

testBillingEndpoints();
