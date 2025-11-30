const db = require('./config/db.config');

async function fixRajkumarInvoice() {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        console.log('🔧 Fixing Rajkumar rao invoice...\n');

        // Get the invoice and EMI plan
        const [invoices] = await connection.query(`
      SELECT i.*, ep.emi_plan_id
      FROM invoices i
      JOIN emi_plans ep ON i.invoice_id = ep.invoice_id
      WHERE i.invoice_number = 'LAB/LAB/25-26/1'
    `);

        if (invoices.length === 0) {
            console.log('Invoice not found');
            await connection.rollback();
            process.exit(0);
        }

        const invoice = invoices[0];
        const totalAmount = parseFloat(invoice.total_amount);
        const currentPaid = parseFloat(invoice.paid_amount);
        const balance = parseFloat(invoice.balance_amount);

        console.log(`Current Status:`);
        console.log(`  Total: ₹${totalAmount}`);
        console.log(`  Paid: ₹${currentPaid}`);
        console.log(`  Balance: ₹${balance}\n`);

        // Since all installments are marked as paid, we should mark the invoice as paid
        // and fix the paid_amount to equal total_amount
        await connection.query(`
      UPDATE invoices
      SET paid_amount = total_amount,
          balance_amount = 0,
          payment_status = 'paid'
      WHERE invoice_id = ?
    `, [invoice.invoice_id]);

        await connection.query(`
      UPDATE emi_plans
      SET status = 'completed'
      WHERE emi_plan_id = ?
    `, [invoice.emi_plan_id]);

        console.log(`✅ Fixed invoice:`);
        console.log(`  Paid Amount: ₹${currentPaid} → ₹${totalAmount}`);
        console.log(`  Balance: ₹${balance} → ₹0.00`);
        console.log(`  Status: partial → paid\n`);

        await connection.commit();
        console.log('✨ Invoice fixed successfully!');
        process.exit(0);
    } catch (error) {
        await connection.rollback();
        console.error('Error:', error);
        process.exit(1);
    } finally {
        connection.release();
    }
}

fixRajkumarInvoice();
