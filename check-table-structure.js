const db = require('./backend/config/db.config');

async function checkTableStructure() {
  const connection = await db.getConnection();
  
  try {
    console.log('🔍 ===== CHECKING DATABASE STRUCTURE =====\n');

    // Check what tables exist
    console.log('1️⃣ Checking existing tables...');
    const [tables] = await connection.query('SHOW TABLES');
    console.log('   Existing tables:', tables.map(t => Object.values(t)[0]).join(', '));

    // Check patients table structure
    console.log('\n2️⃣ Checking patients table structure...');
    try {
      const [patientColumns] = await connection.query('DESCRIBE patients');
      console.log('   Patients table columns:');
      patientColumns.forEach(col => {
        console.log(`     - ${col.Field} (${col.Type}) ${col.Key === 'PRI' ? '[PRIMARY KEY]' : ''}`);
      });
    } catch (err) {
      console.log('   ❌ Patients table does not exist!');
    }

    // Check referring_doctors table structure
    console.log('\n3️⃣ Checking referring_doctors table structure...');
    try {
      const [doctorColumns] = await connection.query('DESCRIBE referring_doctors');
      console.log('   Referring_doctors table columns:');
      doctorColumns.forEach(col => {
        console.log(`     - ${col.Field} (${col.Type}) ${col.Key === 'PRI' ? '[PRIMARY KEY]' : ''}`);
      });
    } catch (err) {
      console.log('   ❌ Referring_doctors table does not exist!');
    }

    // Check lab_test_master table structure
    console.log('\n4️⃣ Checking lab_test_master table structure...');
    try {
      const [testColumns] = await connection.query('DESCRIBE lab_test_master');
      console.log('   Lab_test_master table columns:');
      testColumns.forEach(col => {
        console.log(`     - ${col.Field} (${col.Type}) ${col.Key === 'PRI' ? '[PRIMARY KEY]' : ''}`);
      });
    } catch (err) {
      console.log('   ❌ Lab_test_master table does not exist!');
    }

    console.log('\n✅ ===== TABLE STRUCTURE CHECK COMPLETE =====');

  } catch (error) {
    console.error('❌ Error checking table structure:', error.message);
  } finally {
    connection.release();
    await db.end();
  }
}

checkTableStructure();