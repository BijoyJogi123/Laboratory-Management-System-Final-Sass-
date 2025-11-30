const db = require('./backend/config/db.config');

async function fixCompletedEMIInvoices() {
  const connection = await db.getConnection();

  try {
    console.log('\n🔧 Fixing Completed EMI Invoices\n');

    // Find all EMI plans where all installments are paid
    const [completedEMIs] = await connection.query(`
      SELECT 
        ep.emi_plan_id,
        ep.invoice_id,
        ep.status as emi_status,
        i.invoice_number,
        i.payment_status as invoice_status,
        COUNT(ei.installment_id) as total_installments,
        SUM(CASE WHEN ei.status = 'paid' THEN 1 ELSE 0 END) as paid_installments
      FROM emi_plans ep
      JOIN invoices i ON ep.invoice_id = i.invoice_id
      LEFT JOIN emi_installments ei ON ep.emi_plan_id = ei.emi_plan_id
      WHERE ep.tenant_id = 1
      GROUP BY ep.emi_plan_id
      HAVING total_installments = paid_installments AND paid_installments > 0
    `);

    console.log(`Found ${completedEMIs.length} completed EMI plans\n`);

    for (const emi of completedEMIs) {
      console.log(`📋 EMI Plan ID: ${emi.emi_plan_id}`);
      console.log(`   Invoice: ${emi.invoice_number}`);
      console.log(`   Current EMI Status: ${emi.emi_status}`);
      console.log(`   Current Invoice Status: ${emi.invoice_status}`);
      console.log(`   Installments: ${emi.paid_installments}/${emi.total_installments} paid`);

      // Update EMI status to completed
      if (emi.emi_status !== 'completed') {
        await connection.query(
          `UPDATE emi_plans SET status = 'completed' WHERE emi_plan_id = ?`,
          [emi.emi_plan_id]
        );
        console.log(`   ✅ Updated EMI status to: completed`);
      }

      // Update Invoice status to paid
      if (emi.invoice_status !== 'paid') {
        await connection.query(
          `UPDATE invoices SET 
            payment_status = 'paid',
            balance_amount = 0
           WHERE invoice_id = ?`,
          [emi.invoice_id]
        );
        console.log(`   ✅ Updated Invoice status to: paid`);
      }

      console.log('');
    }

    console.log('✅ All completed EMI invoices fixed!\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    connection.release();
    await db.end();
  }
}

fixCompletedEMIInvoices();
