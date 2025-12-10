const axios = require('axios');

async function testDoctorSystem() {
  console.log('🏥 ===== TESTING DOCTOR SYSTEM =====\n');

  const baseURL = 'http://localhost:5000/api';
  
  // First, login to get token
  console.log('1️⃣ Logging in...');
  try {
    const loginResponse = await axios.post(`${baseURL}/auth/login-user`, {
      email: 'test@lab.com',
      password: 'Test@123'
    });
    
    const token = loginResponse.data.token;
    console.log('   ✅ Login successful');

    const headers = { Authorization: `Bearer ${token}` };

    // Test getting all doctors
    console.log('\n2️⃣ Testing GET /api/doctors...');
    const doctorsResponse = await axios.get(`${baseURL}/doctors`, { headers });
    console.log(`   ✅ Found ${doctorsResponse.data.data.length} doctors`);

    // Test getting doctor stats
    console.log('\n3️⃣ Testing GET /api/doctors/stats...');
    const statsResponse = await axios.get(`${baseURL}/doctors/stats`, { headers });
    console.log('   ✅ Stats retrieved:', statsResponse.data.data);

    // Test creating a new doctor
    console.log('\n4️⃣ Testing POST /api/doctors (Create)...');
    const newDoctor = {
      doctor_name: 'Dr. Test Kumar',
      specialization: 'Cardiology',
      qualification: 'MD, DM',
      registration_number: 'TEST123',
      contact_number: '+91-9999999999',
      email: 'test.doctor@test.com',
      address: 'Test Hospital, Test City',
      commission_type: 'percentage',
      commission_value: 15.00,
      is_active: true
    };

    const createResponse = await axios.post(`${baseURL}/doctors`, newDoctor, { headers });
    console.log('   ✅ Doctor created successfully');
    const doctorId = createResponse.data.data.doctorId;

    // Test getting specific doctor
    console.log('\n5️⃣ Testing GET /api/doctors/:id...');
    const doctorResponse = await axios.get(`${baseURL}/doctors/${doctorId}`, { headers });
    console.log('   ✅ Doctor retrieved:', doctorResponse.data.data.doctor_name);

    // Test updating doctor
    console.log('\n6️⃣ Testing PUT /api/doctors/:id (Update)...');
    const updateData = {
      ...newDoctor,
      doctor_name: 'Dr. Test Kumar Updated',
      commission_value: 20.00
    };
    await axios.put(`${baseURL}/doctors/${doctorId}`, updateData, { headers });
    console.log('   ✅ Doctor updated successfully');

    // Test search functionality
    console.log('\n7️⃣ Testing search functionality...');
    const searchResponse = await axios.get(`${baseURL}/doctors?search=Test`, { headers });
    console.log(`   ✅ Search found ${searchResponse.data.data.length} doctors`);

    // Test filter by specialization
    console.log('\n8️⃣ Testing specialization filter...');
    const filterResponse = await axios.get(`${baseURL}/doctors?specialization=Cardiology`, { headers });
    console.log(`   ✅ Filter found ${filterResponse.data.data.length} cardiologists`);

    // Test delete doctor
    console.log('\n9️⃣ Testing DELETE /api/doctors/:id...');
    await axios.delete(`${baseURL}/doctors/${doctorId}`, { headers });
    console.log('   ✅ Doctor deleted successfully');

    console.log('\n✅ ===== ALL DOCTOR TESTS PASSED =====');
    console.log('\n📋 Doctor System Features:');
    console.log('   ✅ Create doctors with full details');
    console.log('   ✅ View all doctors with stats');
    console.log('   ✅ Search and filter doctors');
    console.log('   ✅ Update doctor information');
    console.log('   ✅ Delete doctors');
    console.log('   ✅ Commission management');
    console.log('   ✅ Specialization tracking');
    console.log('\n🎉 Doctor Management System is fully functional!');
    console.log('\n📝 Next steps:');
    console.log('   1. Visit: http://localhost:3000/doctors');
    console.log('   2. Add doctors for report verification');
    console.log('   3. Set up commission rates');
    console.log('   4. Ready for report generation!');

  } catch (error) {
    console.error('\n❌ Error:', error.response?.data?.message || error.message);
    if (error.response?.status === 401) {
      console.log('   ⚠️  Make sure backend is running and login credentials are correct');
    }
  }
}

testDoctorSystem();