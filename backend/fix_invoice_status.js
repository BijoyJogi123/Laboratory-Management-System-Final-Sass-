const db = require('./config/db.config');

async function fixInvoiceStatuses() {
  try {
    console.log('🔧 Fixing invoice statuses based on EMI payments...');

    // Get all invoices with EMI plans
    const [invoicesWithEMI] = await db.query(`
      SELECT DISTINCT i.invoice_id, i.invoice_number, i.total_amount, i.payment_status,
             ep.emi_plan_id, ep.number_of_installments
      FROM invoices i
      JOIN emi_plans ep ON i.invoice_id = ep.invoice_id
    `);

    console.log(`Found ${invoicesWithEMI.length} invoices with EMI plans`);

    for (const invoice of invoicesWithEMI) {
      // Get installment status
      const [installments] = await db.query(`
        SELECT COUNT(*) as total,
               SUM(CASE WHEN status = 'paid' THEN 1 ELSE 0 END) as paid
        FROM emi_installments
        WHERE emi_plan_id = ?
      `, [invoice.emi_plan_id]);

      const total = installments[0].total;
      const paid = installments[0].paid;

      // Get current invoice balance
      const [invoiceData] = await db.query(`
        SELECT balance_amount, paid_amount, total_amount
        FROM invoices
        WHERE invoice_id = ?
      `, [invoice.invoice_id]);

      const balance = parseFloat(invoiceData[0].balance_amount);
      const paidAmount = parseFloat(invoiceData[0].paid_amount);
      const totalAmount = parseFloat(invoiceData[0].total_amount);

      let newStatus = 'unpaid';
      let emiPlanStatus = 'active';

      // If balance is 0 or negative (overpaid), or all installments paid, mark as paid
      if ((balance <= 0 && paidAmount > 0) || (paid === total && paid > 0)) {
        newStatus = 'paid';
        emiPlanStatus = 'completed';

        // Fix negative balance to 0
        if (balance < 0) {
          await db.query(`
            UPDATE invoices 
            SET balance_amount = 0,
                paid_amount = total_amount
            WHERE invoice_id = ?
          `, [invoice.invoice_id]);
          console.log(`  ⚠️  Fixed overpayment: balance was ${balance}, set to 0`);
        }
      } else if (paid > 0 || paidAmount > 0) {
        newStatus = 'partial';
      }

      // Update invoice status
      await db.query(`
        UPDATE invoices 
        SET payment_status = ? 
        WHERE invoice_id = ?
      `, [newStatus, invoice.invoice_id]);

      // Update EMI plan status
      await db.query(`
        UPDATE emi_plans 
        SET status = ? 
        WHERE emi_plan_id = ?
      `, [emiPlanStatus, invoice.emi_plan_id]);

      console.log(`✅ Updated ${invoice.invoice_number}: ${paid}/${total} installments paid, Balance: ₹${balance.toFixed(2)} -> Status: ${newStatus}`);
    }

    console.log('✨ All invoice statuses fixed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing invoice statuses:', error);
    process.exit(1);
  }
}

fixInvoiceStatuses();
