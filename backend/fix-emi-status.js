const db = require('./config/db.config');

async function fixEMIStatus() {
  try {
    console.log('🔍 Finding EMI plans that should be completed...\n');
    
    // Find EMI plans where all installments are paid but EMI is still active
    const [problemEMIs] = await db.query(`
      SELECT 
        ep.emi_plan_id,
        ep.invoice_id,
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
      console.log(`   EMI Status: ${emi.emi_status} → should be completed`);
      console.log(`   Invoice Status: ${emi.payment_status} → should be paid`);
      console.log(`   Installments: ${emi.paid_installments}/${emi.total_installments} paid`);
      console.log('');
    });
    
    console.log('🔄 FIXING NOW...\n');
    
    // Fix each EMI plan and its invoice
    for (const emi of problemEMIs) {
      console.log(`📝 Fixing ${emi.patient_name} (${emi.invoice_number})`);
      
      // Update EMI plan to completed
      await db.query(
        `UPDATE emi_plans SET status = 'completed' WHERE emi_plan_id = ?`,
        [emi.emi_plan_id]
      );
      console.log(`   ✅ EMI Plan → completed`);
      
      // Update invoice to paid
      await db.query(`
        UPDATE invoices SET 
          payment_status = 'paid',
          paid_amount = total_amount,
          balance_amount = 0
        WHERE invoice_id = ?
      `, [emi.invoice_id]);
      console.log(`   ✅ Invoice → paid`);
      console.log('');
    }
    
    console.log('🎉 ALL FIXED SUCCESSFULLY!');
    console.log('==========================');
    console.log('✅ EMI Management page will show "completed"');
    console.log('✅ Billing page will show "paid"');
    console.log('\n📱 Refresh your pages now!');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

fixEMIStatus();