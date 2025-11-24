const mysql = require('mysql2/promise');

async function test() {
  console.log('Testing with hardcoded credentials...');
  try {
    const connection = await mysql.createConnection({
      host: '127.0.0.1',
      user: 'root',
      password: 'Cyberdumb#123',
      database: 'laboratory'
    });
    console.log('✅ Connection successful!');
    await connection.end();
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  }
}

test();
