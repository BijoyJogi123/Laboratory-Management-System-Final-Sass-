const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'backend', '.env') });

async function fixEMIStatusDirect() {
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
    
    // Find EMI plans where all installments are paid but EMI is still active
    console.log('🔍 Finding EMI plans that should be completed...');
    
    const [problemEMIs] = await connection.query(`
      SELECT 
        ep.emi_plan_id,
        ep.status as emi_status,
        i.invoice_number,
        i.payment_status,
        i.patient_name,
        COUNT(ei.installment_id) as total_installments,
        SUM(CASE WHEN ei.status = 'paid' THEN 1 ELSE 0 END) as paid_installments
      FROM emi_plans ep
      JOIN invoices i ON ep.invoice_id = i.invoice_id
      LEFT JOIN emi_installments ei ON ep.emi_plan_id = ei.emi_plan_id
      WHERE ep.status = 'active'
      GROUP BY ep.emi_plan_id
      HAVING total_installments = paid_installments AND total_installments > 0
    `);
    
    console.log(`Found ${problemEMIs.length} EMI plans that need fixing:\n`);
    
    if (problemEMIs.length === 0) {
      console.log('✅ No EMI plans need fixing!');
      return;
    }
    
    // Show what we found
    problemEMIs.forEach(emi => {
      console.log(`❌ ${emi.patient_name} (${emi.invoice_number})`);
      console.log(`   EMI Status: ${emi.emi_status} (should be completed)`);
      console.log(`   Invoice Status: ${emi.payment_status} (should be paid)`);
      console.log(`   Installments: ${emi.paid_installments}/${emi.total_installments} paid`);
      console.log('');
    });
    
    // Fix EMI plans - mark as completed
    console.log('🔄 Updating EMI plans to completed...');
    for (const emi of problemEMIs) {
      await connection.query(
        `UPDATE emi_plans SET status = 'completed' WHERE emi_plan_id = ?`,
        [emi.emi_plan_id]
      );
      console.log(`✅ EMI Plan ${emi.emi_plan_id} (${emi.patient_name}) → completed`);
    }
    
    // Fix invoices - mark as paid
    console.log('\n🔄 Updating invoices to paid...');
    for (const emi of problemEMIs) {
      await connection.query(`
        UPDATE invoices i
        JOIN emi_plans ep ON i.invoice_id = ep.invoice_id
        SET 
          i.payment_status = 'paid',
          i.paid_amount = i.total_amount,
          i.balance_amount = 0
        WHERE ep.emi_plan_id = ?
      `, [emi.emi_plan_id]);
      console.log(`✅ Invoice ${emi.invoice_number} (${emi.patient_name}) → paid`);
    }
    
    console.log('\n🎉 ALL FIXED!');
    console.log('================');
    console.log('✅ EMI plans marked as completed');
    console.log('✅ Invoices marked as paid');
    console.log('✅ Balances set to 0');
    console.log('\n📱 Refresh your pages to see the changes!');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

fixEMIStatusDirect();