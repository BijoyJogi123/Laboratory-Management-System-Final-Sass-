const db = require('./backend/config/db.config');

async function testEMIAutoStatus() {
  const connection = await db.getConnection();

  try {
    console.log('\n🔍 Testing EMI Auto-Status Update Logic\n');

    // Get all EMI plans with their installment status
    const [emiPlans] = await connection.query(`
      SELECT 
        ep.emi_plan_id,
        ep.invoice_id,
        ep.status as emi_status,
        i.invoice_number,
        i.payment_status as invoice_status,
        COUNT(ei.installment_id) as total_installments,
        SUM(CASE WHEN ei.status = 'paid' THEN 1 ELSE 0 END) as paid_installments,
        SUM(CASE WHEN ei.status = 'pending' THEN 1 ELSE 0 END) as pending_installments
      FROM emi_plans ep
      JOIN invoices i ON ep.invoice_id = i.invoice_id
      LEFT JOIN emi_installments ei ON ep.emi_plan_id = ei.emi_plan_id
      WHERE ep.tenant_id = 1
      GROUP BY ep.emi_plan_id
    `);

    console.log(`Found ${emiPlans.length} EMI plans:\n`);

    for (const plan of emiPlans) {
      console.log(`📋 EMI Plan ID: ${plan.emi_plan_id}`);
      console.log(`   Invoice: ${plan.invoice_number}`);
      console.log(`   EMI Status: ${plan.emi_status}`);
      console.log(`   Invoice Status: ${plan.invoice_status}`);
      console.log(`   Installments: ${plan.paid_installments}/${plan.total_installments} paid`);
      
      // Check if status needs update
      if (plan.total_installments === plan.paid_installments) {
        if (plan.emi_status !== 'completed' || plan.invoice_status !== 'paid') {
          console.log(`   ⚠️  NEEDS FIX: All installments paid but status not updated!`);
          console.log(`   🔧 Fixing now...`);
          
          // Update EMI status
          await connection.query(
            `UPDATE emi_plans SET status = 'completed' WHERE emi_plan_id = ?`,
            [plan.emi_plan_id]
          );
          
          // Update Invoice status
          await connection.query(
            `UPDATE invoices SET 
              payment_status = 'paid',
              balance_amount = 0
             WHERE invoice_id = ?`,
            [plan.invoice_id]
          );
          
          console.log(`   ✅ Fixed! EMI → completed, Invoice → paid`);
        } else {
          console.log(`   ✅ Status is correct!`);
        }
      } else if (plan.paid_installments > 0) {
        if (plan.invoice_status !== 'partial') {
          console.log(`   ⚠️  NEEDS FIX: Some installments paid but invoice not marked partial!`);
          console.log(`   🔧 Fixing now...`);
          
          await connection.query(
            `UPDATE invoices SET payment_status = 'partial' WHERE invoice_id = ?`,
            [plan.invoice_id]
          );
          
          console.log(`   ✅ Fixed! Invoice → partial`);
        } else {
          console.log(`   ✅ Status is correct!`);
        }
      } else {
        console.log(`   ℹ️  No payments yet`);
      }
      console.log('');
    }

    console.log('\n✅ Test Complete!\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    connection.release();
    await db.end();
  }
}

testEMIAutoStatus();
