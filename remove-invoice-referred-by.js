const db = require('./backend/config/db.config');

async function removeInvoiceReferredBy() {
  const connection = await db.getConnection();
  
  try {
    console.log('\n🔧 Removing referred_by from invoices table...\n');

    try {
      await connection.query(`ALTER TABLE invoices DROP COLUMN referred_by`);
    } catch (err) {
      if (err.code === 'ER_CANT_DROP_FIELD_OR_KEY') {
        console.log('ℹ️  Column already removed or does not exist');
        return;
      }
      throw err;
    }
    
    console.log('✅ Column removed from invoices table');
    console.log('ℹ️  Referred By will now come from patients table via JOIN\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    connection.release();
    await db.end();
  }
}

removeInvoiceReferredBy();
