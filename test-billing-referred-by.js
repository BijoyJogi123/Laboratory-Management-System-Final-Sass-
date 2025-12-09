const db = require('./backend/config/db.config');

async function testBillingReferredBy() {
  const connection = await db.getConnection();
  
  try {
    console.log('\n🧪 Testing Billing Referred By\n');

    // First, add referred_by to some patients
    console.log('📝 Adding test referred_by values to patients...');
    await connection.query(`UPDATE patients SET referred_by = 'XYZ Lab' WHERE patient_name LIKE '%rohit%'`);
    await connection.query(`UPDATE patients SET referred_by = 'ABC Laboratory' WHERE patient_name LIKE '%Shaibal%'`);
    console.log('✅ Updated patients with referred_by values\n');

    // Check patients
    const [patients] = await connection.query(`
      SELECT id, patient_name, referred_by 
      FROM patients 
      WHERE patient_name LIKE '%rohit%' OR patient_name LIKE '%Shaibal%'
    `);
    
    console.log('📋 Patients:');
    patients.forEach(p => {
      console.log(`   ID: ${p.id} | ${p.patient_name} | Referred By: "${p.referred_by || '(NULL)'}"`);
    });

    // Test the exact backend query
    console.log('\n🔍 Testing Backend Query (with JOIN):');
    const [invoices] = await connection.query(`
      SELECT i.invoice_id, i.invoice_number, i.patient_id,
        COALESCE(p.patient_name, i.patient_name) as patient_name,
        p.referred_by as referred_by,
        COUNT(ii.item_id) as item_count
      FROM invoices i
      LEFT JOIN invoice_items ii ON i.invoice_id = ii.invoice_id
      LEFT JOIN patients p ON i.patient_id = p.id
      WHERE i.tenant_id = 1
      GROUP BY i.invoice_id 
      ORDER BY i.invoice_date DESC
      LIMIT 5
    `);

    console.log('\n📊 Invoices with Referred By:');
    invoices.forEach(inv => {
      console.log(`   ${inv.invoice_number} | Patient ID: ${inv.patient_id} | ${inv.patient_name} | Referred By: "${inv.referred_by || '(NULL)'}"`);
    });

    console.log('\n✅ Test complete! Restart backend and refresh browser.\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    connection.release();
    await db.end();
  }
}

testBillingReferredBy();
