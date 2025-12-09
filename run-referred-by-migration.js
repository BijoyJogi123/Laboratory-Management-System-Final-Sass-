const db = require('./backend/config/db.config');

async function addReferredByColumn() {
  const connection = await db.getConnection();
  
  try {
    console.log('\n🔧 Adding referred_by column to database...\n');

    // Add to patients table
    console.log('📋 Adding referred_by to patients table...');
    try {
      await connection.query(`
        ALTER TABLE patients 
        ADD COLUMN referred_by VARCHAR(255) DEFAULT NULL AFTER address
      `);
      console.log('✅ Added to patients table');
    } catch (err) {
      if (err.code === 'ER_DUP_FIELDNAME') {
        console.log('ℹ️  Column already exists in patients table');
      } else {
        throw err;
      }
    }

    // Add to invoices table
    console.log('📋 Adding referred_by to invoices table...');
    try {
      await connection.query(`
        ALTER TABLE invoices 
        ADD COLUMN referred_by VARCHAR(255) DEFAULT NULL AFTER patient_address
      `);
      console.log('✅ Added to invoices table');
    } catch (err) {
      if (err.code === 'ER_DUP_FIELDNAME') {
        console.log('ℹ️  Column already exists in invoices table');
      } else {
        throw err;
      }
    }

    console.log('\n✅ Migration complete! referred_by column added successfully.\n');

  } catch (error) {
    if (error.code === 'ER_DUP_FIELDNAME') {
      console.log('ℹ️  Column already exists, skipping...');
    } else {
      console.error('❌ Error:', error.message);
    }
  } finally {
    connection.release();
    await db.end();
  }
}

addReferredByColumn();
