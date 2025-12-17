const http = require('http');

const testSettingsRoute = () => {
  console.log('🧪 Testing Settings Route...\n');

  // Test if server is running and has settings routes
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/settings/lab-info',
    method: 'GET',
    headers: {
      'Authorization': 'Bearer test-token'
    }
  };

  const req = http.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Headers:`, res.headers);

    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      console.log('Response:', data);
      
      if (res.statusCode === 404) {
        console.log('\n❌ ROUTE NOT FOUND!');
        console.log('🔧 SOLUTION:');
        console.log('1. Make sure you are running server.js (not working-server.js)');
        console.log('2. Restart the backend server');
        console.log('3. Check if settingsRoutes is properly imported');
      } else if (res.statusCode === 401) {
        console.log('\n✅ ROUTE EXISTS! (401 = auth required, which is expected)');
      } else {
        console.log('\n✅ ROUTE WORKING!');
      }
    });
  });

  req.on('error', (e) => {
    console.error(`❌ Error: ${e.message}`);
    console.log('\n🔧 Make sure backend server is running on port 5000');
  });

  req.end();
};

testSettingsRoute();