const db = require('./backend/config/db.config');

async function debugDoctorIssue() {
  const connection = await db.getConnection();
  
  try {
    console.log('🔍 ===== DEBUGGING DOCTOR ISSUE =====\n');

    // Check if table exists
    console.log('1️⃣ Checking if referring_doctors table exists...');
    try {
      const [tables] = await connection.query(`
        SHOW TABLES LIKE 'referring_doctors'
      `);
      
      if (tables.length === 0) {
        console.log('❌ referring_doctors table does not exist!');
        console.log('   Run: node setup-doctor-tables.js');
        return;
      }
      console.log('✅ referring_doctors table exists');
    } catch (err) {
      console.log('❌ Error checking table:', err.message);
      return;
    }

    // Check table structure
    console.log('\n2️⃣ Checking table structure...');
    const [columns] = await connection.query(`DESCRIBE referring_doctors`);
    console.log('   Columns:', columns.map(col => col.Field).join(', '));

    // Check if there are any doctors
    console.log('\n3️⃣ Checking existing doctors...');
    const [doctors] = await connection.query(`SELECT * FROM referring_doctors`);
    console.log(`   Total doctors in database: ${doctors.length}`);
    
    if (doctors.length > 0) {
      console.log('\n   Existing doctors:');
      doctors.forEach((doctor, index) => {
        console.log(`   ${index + 1}. ${doctor.doctor_name} (${doctor.specialization || 'No specialization'}) - Active: ${doctor.is_active}`);
      });
    }

    // Test the API query that frontend uses
    console.log('\n4️⃣ Testing API query (no filters)...');
    const [apiResult] = await connection.query(`
      SELECT * FROM referring_doctors WHERE tenant_id = ? ORDER BY doctor_name
    `, [1]);
    console.log(`   API query result: ${apiResult.length} doctors`);

    // Test with active filter
    console.log('\n5️⃣ Testing with is_active = true filter...');
    const [activeResult] = await connection.query(`
      SELECT * FROM referring_doctors WHERE tenant_id = ? AND is_active = ? ORDER BY doctor_name
    `, [1, true]);
    console.log(`   Active doctors: ${activeResult.length}`);

    // Test with is_active = false filter
    console.log('\n6️⃣ Testing with is_active = false filter...');
    const [inactiveResult] = await connection.query(`
      SELECT * FROM referring_doctors WHERE tenant_id = ? AND is_active = ? ORDER BY doctor_name
    `, [1, false]);
    console.log(`   Inactive doctors: ${inactiveResult.length}`);

    // Add a test doctor if none exist
    if (doctors.length === 0) {
      console.log('\n7️⃣ Adding a test doctor...');
      await connection.query(`
        INSERT INTO referring_doctors (
          doctor_name, specialization, qualification, registration_number,
          contact_number, email, address, commission_type, commission_value, is_active
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        'Dr. Debug Test',
        'General',
        'MBBS',
        'DEBUG123',
        '+91-1234567890',
        'debug@test.com',
        'Debug Hospital',
        'percentage',
        10.00,
        true
      ]);
      console.log('   ✅ Test doctor added');
      
      // Check again
      const [newCount] = await connection.query(`SELECT COUNT(*) as count FROM referring_doctors`);
      console.log(`   New total: ${newCount[0].count} doctors`);
    }

    console.log('\n✅ ===== DEBUG COMPLETE =====');
    console.log('\n📝 Next steps:');
    console.log('   1. If table was missing, run: node setup-doctor-tables.js');
    console.log('   2. Restart backend server');
    console.log('   3. Try adding doctor again');
    console.log('   4. Check browser console for errors');

  } catch (error) {
    console.error('❌ Debug error:', error.message);
  } finally {
    connection.release();
    await db.end();
  }
}

debugDoctorIssue();