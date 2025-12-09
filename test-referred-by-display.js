const db = require('./backend/config/db.config');

async function testReferredByDisplay() {
  const connection = await db.getConnection();
  
  try {
    console.log('\n🧪 Testing Referred By Display\n');

    // Update first invoice with a test referred_by value
    console.log('📝 Adding test referred_by value to first invoice...');
    await connection.query(`
      UPDATE invoices 
      SET referred_by = 'ABC Laboratory' 
      WHERE invoice_id = (SELECT invoice_id FROM (SELECT invoice_id FROM invoices LIMIT 1) as temp)
    `);
    
    console.log('✅ Updated first invoice with referred_by = "ABC Laboratory"');

    // Show all invoices with their referred_by values
    const [invoices] = await connection.query(`
      SELECT invoice_number, patient_name, referred_by 
      FROM invoices 
      ORDER BY invoice_id 
      LIMIT 5
    `);

    console.log('\n📋 Current Invoices:');
    invoices.forEach(inv => {
      console.log(`   ${inv.invoice_number} - ${inv.patient_name} - Referred By: ${inv.referred_by || '(empty)'}`);
    });

    console.log('\n✅ Test complete! Refresh your billing page to see the change.\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    connection.release();
    await db.end();
  }
}

testReferredByDisplay();
