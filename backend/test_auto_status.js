const db = require('./config/db.config');

async function testAutoStatusUpdate() {
    try {
        console.log('🧪 Testing automatic status update...\n');

        // Create a test invoice with EMI
        const connection = await db.getConnection();
        await connection.beginTransaction();

        // Create test invoice
        const [invoiceResult] = await connection.query(`
      INSERT INTO invoices (
        tenant_id, invoice_number, invoice_date, patient_id, patient_name,
        total_amount, paid_amount, balance_amount, payment_status, created_by
      ) VALUES (1, 'TEST-001', NOW(), 1, 'Test Patient', 3000, 0, 3000, 'unpaid', 1)
        for (let i = 1; i <= 3; i++) {
            await connection.query(`
        INSERT INTO emi_installments(
            emi_plan_id, installment_number, due_date, amount, status
        ) VALUES(?, ?, DATE_ADD(NOW(), INTERVAL ? MONTH), 1000, 'pending')
            `, [emiPlanId, i, i]);
        }
        console.log(`✅ Created 3 installments\n`);

        await connection.commit();

        // Now test the payment flow
        console.log('Testing payment flow...\n');

        // Get installments
        const [installments] = await db.query(`
      SELECT * FROM emi_installments WHERE emi_plan_id = ? ORDER BY installment_number
            `, [emiPlanId]);

        // Import the EMI model
        const EMIModel = require('./models/emiModel');

        // Pay each installment
        for (let i = 0; i < installments.length; i++) {
            const inst = installments[i];
            console.log(`Paying installment #${ inst.installment_number }...`);

            await EMIModel.payInstallment(inst.installment_id, 1, {
                amount: 1000,
                payment_mode: 'cash',
                payment_date: new Date(),
                transaction_number: `TEST - TXN - ${ i + 1}`,
                received_by: 1
            });

            // Check invoice status
            const [invoice] = await db.query(`
        SELECT payment_status, paid_amount, balance_amount 
        FROM invoices WHERE invoice_id = ?
        `, [invoiceId]);

            console.log(`  → Invoice status: ${ invoice[0].payment_status }, Paid: ₹${ invoice[0].paid_amount }, Balance: ₹${ invoice[0].balance_amount } \n`);
        }

        // Final check
        const [finalInvoice] = await db.query(`
      SELECT payment_status, paid_amount, balance_amount 
      FROM invoices WHERE invoice_id = ?
        `, [invoiceId]);

        console.log('Final Result:');
        console.log(`  Status: ${ finalInvoice[0].payment_status } `);
        console.log(`  Paid: ₹${ finalInvoice[0].paid_amount } `);
        console.log(`  Balance: ₹${ finalInvoice[0].balance_amount } `);

        if (finalInvoice[0].payment_status === 'paid' && finalInvoice[0].balance_amount == 0) {
            console.log('\n✅ SUCCESS! Automatic status update is working!');
        } else {
            console.log('\n❌ FAILED! Status should be "paid" with balance 0');
        }

        // Cleanup
        await db.query('DELETE FROM invoices WHERE invoice_id = ?', [invoiceId]);
        console.log('\n🧹 Cleaned up test data');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

testAutoStatusUpdate();
