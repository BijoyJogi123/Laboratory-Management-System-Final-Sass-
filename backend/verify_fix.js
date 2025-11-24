const db = require('./config/db.config');

async function checkLatestInvoice() {
    try {
        const [invoices] = await db.query('SELECT * FROM invoices ORDER BY invoice_id DESC LIMIT 1');
        if (invoices.length === 0) {
            console.log('No invoices found.');
            process.exit(0);
        }

        const invoice = invoices[0];
        console.log('Latest Invoice ID:', invoice.invoice_id);
        console.log('Invoice Date:', invoice.invoice_date);

        const [items] = await db.query('SELECT * FROM invoice_items WHERE invoice_id = ?', [invoice.invoice_id]);
        console.log('Items count:', items.length);
        if (items.length > 0) {
            console.log('First Item Name:', items[0].item_name);
        } else {
            console.log('No items found for this invoice.');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkLatestInvoice();
