const db = require('./config/db.config');
const fs = require('fs');

async function checkData() {
    try {
        const [tests] = await db.query('SELECT * FROM lab_test_master LIMIT 5');
        const [items] = await db.query('SELECT * FROM lab_items LIMIT 5');

        const output = {
            lab_test_master: tests,
            lab_items: items
        };

        fs.writeFileSync('data_output.json', JSON.stringify(output, null, 2));
        console.log('Data written to data_output.json');
        process.exit(0);
    } catch (error) {
        console.error('Error fetching data:', error);
        process.exit(1);
    }
}

checkData();
