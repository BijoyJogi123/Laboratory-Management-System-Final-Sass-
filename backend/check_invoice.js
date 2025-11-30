const db = require('./config/db.config');

async function checkInvoiceDetails() {
    try {
        console.log('🔍 Checking invoice details...\n');

        // Get invoice LAB/LAB/25-26/1
        const [invoices] = await db.query(`
      SELECT i.*, ep.emi_plan_id, ep.down_payment, ep.emi_amount, ep.number_of_installments
      FROM invoices i
      LEFT JOIN emi_plans ep ON i.invoice_id = ep.invoice_id
      WHERE i.invoice_number = 'LAB/LAB/25-26/1'
    `);

        if (invoices.length === 0) {
            console.log('Invoice not found');
            process.exit(0);
        }

        const invoice = invoices[0];
        console.log('Invoice Details:');
        console.log(`  Invoice Number: ${invoice.invoice_number}`);
        console.log(`  Total Amount: ₹${invoice.total_amount}`);
        console.log(`  Paid Amount: ₹${invoice.paid_amount}`);
        console.log(`  Balance: ₹${invoice.balance_amount}`);
        console.log(`  Payment Status: ${invoice.payment_status}`);
        console.log(`\nEMI Plan:`);
        console.log(`  Down Payment: ₹${invoice.down_payment || 0}`);
        console.log(`  EMI Amount: ₹${invoice.emi_amount}`);
        console.log(`  Number of Installments: ${invoice.number_of_installments}`);
        console.log(`  Total EMI: ₹${invoice.emi_amount * invoice.number_of_installments}`);
        console.log(`  Total (Down + EMI): ₹${(invoice.down_payment || 0) + (invoice.emi_amount * invoice.number_of_installments)}`);

        // Get installments
        const [installments] = await db.query(`
      SELECT * FROM emi_installments
      WHERE emi_plan_id = ?
      ORDER BY installment_number
    `, [invoice.emi_plan_id]);

        console.log(`\nInstallments:`);
        let totalPaid = 0;
        installments.forEach(inst => {
            console.log(`  #${inst.installment_number}: Amount: ₹${inst.amount}, Paid: ₹${inst.paid_amount || 0}, Status: ${inst.status}`);
            totalPaid += parseFloat(inst.paid_amount || 0);
        });
        console.log(`\nTotal Paid via Installments: ₹${totalPaid}`);
        console.log(`Expected Total: ₹${invoice.total_amount}`);
        console.log(`Difference: ₹${invoice.total_amount - (invoice.down_payment || 0) - totalPaid}`);

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkInvoiceDetails();
