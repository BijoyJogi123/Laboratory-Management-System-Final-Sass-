const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'backend', '.env') });

async function fixCompletedEMIInvoices() {
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
    
    // Find all completed EMI plans and their invoice status
    console.log('🔍 Finding completed EMI plans...');
    
    const [completedEMIs] = await connection.query(`
      SELECT 
        ep.emi_plan_id,
        ep.invoice_id,
        ep.status as emi_status,
        i.invoice_number,
        i.payment_status,
        i.patient_name,
        i.total_amount,
        i.paid_amount,
        i.balance_amount
      FROM emi_plans ep
      JOIN invoices i ON ep.invoice_id = i.invoice_id
      WHERE ep.status = 'completed'
      ORDER BY ep.emi_plan_id
    `);
    
    console.log(`Found ${completedEMIs.length} completed EMI plans\n`);
    
    if (completedEMIs.length === 0) {
      console.log('No completed EMI plans found.');
      return;
    }
    
    // Show current status
    console.log('📋 Current Status:');
    console.log('==================');
    completedEMIs.forEach(emi => {
      console.log(`${emi.patient_name} (${emi.invoice_number})`);
      console.log(`  EMI Status: ${emi.emi_status}`);
      console.log(`  Invoice Status: ${emi.payment_status}`);
      console.log(`  Total: ₹${emi.total_amount}, Paid: ₹${emi.paid_amount}, Balance: ₹${emi.balance_amount}`);
      console.log('');
    });
    
    // Update invoices for completed EMIs to paid status
    console.log('🔄 Updating invoice statuses...\n');
    
    for (const emi of completedEMIs) {
      if (emi.payment_status !== 'paid') {
        console.log(`📝 Updating ${emi.patient_name} (${emi.invoice_number})`);
        console.log(`   ${emi.payment_status} → paid`);
        
        await connection.query(`
          UPDATE invoices SET 
            payment_status = 'paid',
            paid_amount = total_amount,
            balance_amount = 0,
            updated_at = CURRENT_TIMESTAMP
          WHERE invoice_id = ?
        `, [emi.invoice_id]);
        
        console.log(`   ✅ Updated successfully\n`);
      } else {
        console.log(`✅ ${emi.patient_name} (${emi.invoice_number}) already marked as paid\n`);
      }
    }
    
    console.log('🎉 All completed EMI invoices are now marked as PAID!');
    console.log('\n📱 Refresh your billing page to see the updated statuses.');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

fixCompletedEMIInvoices();