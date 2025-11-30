const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'backend', '.env') });

async function syncEMIInvoiceStatus() {
  let connection;
  
  try {
    console.log('🔗 Connecting to database...');
    
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || '127.0.0.1',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'laboratory'
    });
    
    console.log('✅ Connected to database\n');
    
    // Find all completed EMI plans with invoices that are not marked as paid
    console.log('🔍 Finding completed EMIs with unpaid invoices...');
    
    const [completedEMIs] = await connection.query(`
      SELECT ep.emi_plan_id, ep.invoice_id, i.invoice_number, i.payment_status, i.patient_name
      FROM emi_plans ep
      JOIN invoices i ON ep.invoice_id = i.invoice_id
      WHERE ep.status = 'completed' AND i.payment_status != 'paid'
    `);
    
    console.log(`Found ${completedEMIs.length} completed EMIs with unpaid invoices\n`);
    
    if (completedEMIs.length === 0) {
      console.log('✅ All completed EMIs have their invoices marked as paid!');
      return;
    }
    
    // Update each invoice to paid status
    for (const emi of completedEMIs) {
      console.log(`📝 Updating Invoice ${emi.invoice_number} (${emi.patient_name})`);
      console.log(`   Current status: ${emi.payment_status} → paid`);
      
      await connection.query(`
        UPDATE invoices SET 
          payment_status = 'paid',
          balance_amount = 0,
          updated_at = CURRENT_TIMESTAMP
        WHERE invoice_id = ?
      `, [emi.invoice_id]);
      
      console.log(`   ✅ Updated successfully\n`);
    }
    
    console.log('🎉 All completed EMIs now have their invoices marked as PAID!');
    console.log('\nRefresh your billing page to see the updated statuses.');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

syncEMIInvoiceStatus();