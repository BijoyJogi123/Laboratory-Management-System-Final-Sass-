const mysql = require('mysql2/promise');
require('dotenv').config({ path: './backend/.env' });

async function verifySetup() {
  console.log('🔍 Verifying Laboratory Management System Setup...\n');

  // Check 1: Database Connection
  console.log('1️⃣ Checking database connection...');
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });
    console.log('   ✅ Database connection successful');
    
    // Check 2: Verify new tables exist
    console.log('\n2️⃣ Checking if new tables exist...');
    const tables = [
      'tenants',
      'invoices',
      'invoice_items',
      'emi_plans',
      'emi_installments',
      'party_ledger',
      'test_packages',
      'package_tests'
    ];
    
    let allTablesExist = true;
    for (const table of tables) {
      try {
        await connection.query(`SELECT 1 FROM ${table} LIMIT 1`);
        console.log(`   ✅ Table '${table}' exists`);
      } catch (error) {
        console.log(`   ❌ Table '${table}' NOT FOUND`);
        allTablesExist = false;
      }
    }
    
    if (!allTablesExist) {
      console.log('\n⚠️  Some tables are missing!');
      console.log('   Run: mysql -u root -p laboratory < DATABASE_SCHEMA_UPGRADE.sql');
      await connection.end();
      return false;
    }
    
    // Check 3: Verify tenant exists
    console.log('\n3️⃣ Checking if default tenant exists...');
    const [tenants] = await connection.query('SELECT * FROM tenants LIMIT 1');
    if (tenants.length === 0) {
      console.log('   ⚠️  No tenant found. Creating default tenant...');
      await connection.query(`
        INSERT INTO tenants (
          tenant_name, tenant_code, email, phone, 
          address, city, state, status, subscription_plan_id
        ) VALUES (
          'Demo Laboratory', 'DL', 'admin@demolab.com', '9876543210',
          '123 Main Street', 'Mumbai', 'Maharashtra', 'active', 2
        )
      `);
      console.log('   ✅ Default tenant created');
    } else {
      console.log(`   ✅ Tenant found: ${tenants[0].tenant_name}`);
    }
    
    // Check 4: Count records
    console.log('\n4️⃣ Checking data...');
    const [invoiceCount] = await connection.query('SELECT COUNT(*) as count FROM invoices');
    const [emiCount] = await connection.query('SELECT COUNT(*) as count FROM emi_plans');
    const [packageCount] = await connection.query('SELECT COUNT(*) as count FROM test_packages');
    
    console.log(`   📊 Invoices: ${invoiceCount[0].count}`);
    console.log(`   📊 EMI Plans: ${emiCount[0].count}`);
    console.log(`   📊 Packages: ${packageCount[0].count}`);
    
    await connection.end();
    
    console.log('\n✅ Setup verification complete!');
    console.log('\n🚀 Next steps:');
    console.log('   1. Start server: cd backend && node server-upgraded.js');
    console.log('   2. Run tests: node test-new-features.js');
    console.log('   3. Or use: start-upgraded-system.bat');
    
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('\n💡 Make sure:');
    console.log('   1. MySQL is running');
    console.log('   2. Database "laboratory" exists');
    console.log('   3. Credentials in backend/.env are correct');
    return false;
  }
}

verifySetup().then(success => {
  process.exit(success ? 0 : 1);
});
