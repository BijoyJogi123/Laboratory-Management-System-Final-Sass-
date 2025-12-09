const db = require('./backend/config/db.config');

async function addTestGroups() {
  const connection = await db.getConnection();
  
  try {
    console.log('\n🔧 Adding Test Groups Feature...\n');

    // Add test_type column
    console.log('📝 Adding test_type column...');
    try {
      await connection.query(`
        ALTER TABLE lab_test_master 
        ADD COLUMN test_type ENUM('single', 'group') DEFAULT 'single' AFTER ref_value
      `);
      console.log('✅ Added test_type column');
    } catch (err) {
      if (err.code === 'ER_DUP_FIELDNAME') {
        console.log('ℹ️  test_type column already exists');
      } else {
        throw err;
      }
    }

    // Add parent_test_id column
    console.log('📝 Adding parent_test_id column...');
    try {
      await connection.query(`
        ALTER TABLE lab_test_master 
        ADD COLUMN parent_test_id INT DEFAULT NULL AFTER test_type
      `);
      console.log('✅ Added parent_test_id column');
    } catch (err) {
      if (err.code === 'ER_DUP_FIELDNAME') {
        console.log('ℹ️  parent_test_id column already exists');
      } else {
        throw err;
      }
    }

    // Add price column if it doesn't exist
    console.log('📝 Adding price column...');
    try {
      await connection.query(`
        ALTER TABLE lab_test_master 
        ADD COLUMN price DECIMAL(10,2) DEFAULT 0.00 AFTER parent_test_id
      `);
      console.log('✅ Added price column');
    } catch (err) {
      if (err.code === 'ER_DUP_FIELDNAME') {
        console.log('ℹ️  price column already exists');
      } else {
        throw err;
      }
    }

    // Add foreign key
    console.log('📝 Adding foreign key constraint...');
    try {
      await connection.query(`
        ALTER TABLE lab_test_master 
        ADD CONSTRAINT fk_parent_test 
        FOREIGN KEY (parent_test_id) REFERENCES lab_test_master(test_id) ON DELETE CASCADE
      `);
      console.log('✅ Added foreign key constraint');
    } catch (err) {
      if (err.code === 'ER_DUP_KEYNAME') {
        console.log('ℹ️  Foreign key already exists');
      } else {
        console.log('⚠️  Foreign key error (may already exist):', err.message);
      }
    }

    // Add indexes
    console.log('📝 Adding indexes...');
    try {
      await connection.query(`CREATE INDEX idx_parent_test ON lab_test_master(parent_test_id)`);
      await connection.query(`CREATE INDEX idx_test_type ON lab_test_master(test_type)`);
      console.log('✅ Added indexes');
    } catch (err) {
      console.log('ℹ️  Indexes may already exist');
    }

    console.log('\n✅ Test Groups feature added successfully!\n');
    console.log('Now you can:');
    console.log('- Create single tests (test_type = "single")');
    console.log('- Create group tests (test_type = "group")');
    console.log('- Add sub-tests under groups (parent_test_id = group_id)\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    connection.release();
    await db.end();
  }
}

addTestGroups();
