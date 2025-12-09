const db = require('./backend/config/db.config');

async function checkTestTable() {
  const connection = await db.getConnection();
  
  try {
    console.log('\n🔍 Checking lab_test_master table structure...\n');

    const [columns] = await connection.query(`SHOW COLUMNS FROM lab_test_master`);
    
    console.log('📋 Current Columns:');
    columns.forEach(col => {
      console.log(`   ${col.Field} | ${col.Type} | ${col.Null} | ${col.Key} | ${col.Default}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    connection.release();
    await db.end();
  }
}

checkTestTable();
