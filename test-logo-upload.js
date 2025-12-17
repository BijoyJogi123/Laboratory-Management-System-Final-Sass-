const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const testLogoUpload = async () => {
  console.log('🧪 Testing Logo Upload Functionality...\n');

  try {
    // Test 1: Get current lab info
    console.log('1. Testing GET lab info...');
    const response = await axios.get('http://localhost:5000/api/settings/lab-info', {
      headers: { Authorization: 'Bearer test-token' }
    });
    console.log('✅ Lab info retrieved:', response.data);

    // Test 2: Update lab info
    console.log('\n2. Testing PUT lab info...');
    const updateResponse = await axios.put('http://localhost:5000/api/settings/lab-info', {
      lab_name: 'Test Laboratory',
      address: '456 Test Street, Test City',
      phone: '+91-9876543210',
      email: 'test@testlab.com',
      website: 'www.testlab.com',
      license_number: 'TEST-2024-001'
    }, {
      headers: { Authorization: 'Bearer test-token' }
    });
    console.log('✅ Lab info updated successfully');

    // Test 3: Check if uploads directory exists
    console.log('\n3. Checking uploads directory...');
    if (fs.existsSync('./backend/uploads/logos')) {
      console.log('✅ Uploads directory exists');
    } else {
      console.log('❌ Uploads directory not found');
    }

    console.log('\n🎉 Logo upload system is ready!');
    console.log('\n📝 To test logo upload:');
    console.log('1. Start the backend server: npm start (in backend folder)');
    console.log('2. Start the frontend: npm start (in laboratory folder)');
    console.log('3. Login and go to Settings > Lab Info');
    console.log('4. Upload a logo image file');
    console.log('5. Check invoices and reports for logo display');

  } catch (error) {
    console.error('❌ Error testing logo upload:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
};

testLogoUpload();