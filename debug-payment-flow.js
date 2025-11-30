const db = require('./backend/config/db.config');

async function debugPaymentFlow() {
  const connection = await db.getConnection();

  try {
    console.log('\n🔍 Debugging Shaibal Mitra EMI Status\n');

    // Find Shaibal Mitra's EMI
    const [emiPlans] = await connection.query(`
      SELECT 
        ep.emi_plan_id,
        ep.invoice_id,
        ep.status as emi_status,
        i.invoice_number,
        i.payment_status as invoice_status,
        i.patient_name,
        COUNT(ei.installment_id) as total_installments,
        SUM(CASE WHEN ei.status = 'paid' THEN 1 ELSE 0 END) as paid_installments
      FROM emi_plans ep
      JOIN invoices i ON ep.invoice_id = i.invoice_id
      LEFT JOIN emi_installments ei ON ep.emi_plan_id = ei.emi_plan_id
      WHERE i.patient_name LIKE '%Shaibal%' OR i.patient_name LIKE '%mitra%'
      GROUP BY ep.emi_plan_id
    `);

    if (emiPlans.length === 0) {
      console.log('❌ No EMI found for Shaibal Mitra');
      return;
    }

    for (const plan of emiPlans) {
      console.log(`📋 EMI Plan Details:`);
      console.log(`   Patient: ${plan.patient_name}`);
      console.log(`   EMI Plan ID: ${plan.emi_plan_id}`);
      console.log(`   Invoice: ${plan.invoice_number}`);
      console.log(`   Current EMI Status: ${plan.emi_status}`);
      console.log(`   Current Invoice Status: ${plan.invoice_status}`);
      console.log(`   Installments: ${plan.paid_installments}/${plan.total_installments} paid\n`);

      // Get installment details
      const [installments] = await connection.query(`
        SELECT installment_number, amount, paid_amount, status, payment_date
        FROM emi_installments
        WHERE emi_plan_id = ?
        ORDER BY installment_number
      `, [plan.emi_plan_id]);

      console.log(`📊 Installment Details:`);
      installments.forEach(inst => {
        console.log(`   #${inst.installment_number}: ₹${inst.amount} - Status: ${inst.status} - Paid: ₹${inst.paid_amount || 0}`);
      });

      console.log(`\n🔍 Checking Logic:`);
      console.log(`   Total: ${plan.total_installments}`);
      console.log(`   Paid: ${plan.paid_installments}`);
      console.log(`   Are they equal? ${parseInt(plan.total_installments) === parseInt(plan.paid_installments)}`);
      console.log(`   Is paid > 0? ${parseInt(plan.paid_installments) > 0}`);
      console.log(`   Should trigger update? ${parseInt(plan.total_installments) === parseInt(plan.paid_installments) && parseInt(plan.paid_installments) > 0}`);

      if (parseInt(plan.total_installments) === parseInt(plan.paid_installments) && parseInt(plan.paid_installments) > 0) {
        console.log(`\n✅ SHOULD BE UPDATED! Fixing now...`);
        
        await connection.query(
          `UPDATE emi_plans SET status = 'completed' WHERE emi_plan_id = ?`,
          [plan.emi_plan_id]
        );
        
        await connection.query(
          `UPDATE invoices SET 
            payment_status = 'paid',
            balance_amount = 0
           WHERE invoice_id = ?`,
          [plan.invoice_id]
        );
        
        console.log(`✅ Fixed! EMI → completed, Invoice → paid`);
      }
      console.log('\n');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    connection.release();
    await db.end();
  }
}

debugPaymentFlow();
