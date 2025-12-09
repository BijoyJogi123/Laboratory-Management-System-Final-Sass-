const db = require('./backend/config/db.config');

async function checkReferredByData() {
  const connection = await db.getConnection();
  
  try {
    console.log('\n🔍 Checking Referred By Data\n');

    // Check if column exists
    const [columns] = await connection.query(`
      SHOW COLUMNS FROM invoices LIKE 'referred_by'
    `);
    
    if (columns.length === 0) {
      console.log('❌ Column "referred_by" does NOT exist in invoices table!');
      console.log('   Run: node run-referred-by-migration.js');
      return;
    }
    
    console.log('✅ Column "referred_by" exists in invoices table');

    // Get all invoices with referred_by
    const [invoices] = await connection.query(`
      SELECT invoice_id, invoice_number, patient_name, referred_by, tenant_id
      FROM invoices 
      ORDER BY invoice_id DESC
      LIMIT 5
    `);

    console.log('\n📋 Recent Invoices:');
    invoices.forEach(inv => {
      console.log(`   ID: ${inv.invoice_id} | ${inv.invoice_number} | ${inv.patient_name} | Referred By: "${inv.referred_by || '(NULL)'}"`);
    });

    // Test the exact query the backend uses
    console.log('\n🧪 Testing Backend Query:');
    const [backendResult] = await connection.query(`
      SELECT i.*, 
        COALESCE(p.patient_name, i.patient_name) as patient_name,
        COUNT(ii.item_id) as item_count
      FROM invoices i
      LEFT JOIN invoice_items ii ON i.invoice_id = ii.invoice_id
      LEFT JOIN patients p ON i.patient_id = p.id
      WHERE i.tenant_id = 1
      GROUP BY i.invoice_id 
      ORDER BY i.invoice_date DESC
      LIMIT 3
    `);

    console.log('\n📊 Backend Query Results:');
    backendResult.forEach(inv => {
      console.log(`   ${inv.invoice_number} | Referred By: "${inv.referred_by || '(NULL)'}"`);
    });

    console.log('\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    connection.release();
    await db.end();
  }
}

checkReferredByData();
