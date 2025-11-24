const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'backend', '.env') });

async function createDefaultTenant() {
  let connection;
  
  try {
    console.log('🔗 Connecting to database...');
    
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || '127.0.0.1',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'laboratory'
    });
    
    console.log('✅ Connected to database\n');
    
    // Check if tenants table exists
    const [tables] = await connection.query("SHOW TABLES LIKE 'tenants'");
    
    if (tables.length === 0) {
      console.log('⚠️  Tenants table does not exist!');
      console.log('   Run the full database schema first:');
      console.log('   mysql -u root -p laboratory < DATABASE_SCHEMA_UPGRADE.sql');
      process.exit(1);
    }
    
    // Check if tenant exists
    const [existingTenants] = await connection.query(
      'SELECT * FROM tenants WHERE tenant_id = 1'
    );
    
    if (existingTenants.length > 0) {
      console.log('✅ Default tenant already exists');
      console.log('   Tenant ID:', existingTenants[0].tenant_id);
      console.log('   Tenant Name:', existingTenants[0].tenant_name);
      console.log('   Tenant Code:', existingTenants[0].tenant_code);
    } else {
      console.log('📝 Creating default tenant...');
      try {
        await connection.query(`
          INSERT INTO tenants (
            tenant_id, tenant_name, tenant_code, contact_person,
            email, phone, address, city, state, country, status
          ) VALUES (
            1, 'Default Laboratory', 'LAB', 'Admin',
            'admin@lab.com', '1234567890', 'Lab Address', 
            'City', 'State', 'India', 'active'
          )
        `);
        console.log('✅ Default tenant created');
      } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          console.log('✅ Tenant already exists (duplicate key)');
        } else {
          throw err;
        }
      }
    }
    
    console.log('\n✅ Setup complete!');
    console.log('You can now create invoices.');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

createDefaultTenant();
