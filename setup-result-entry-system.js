const db = require('./backend/config/db.config');

async function setupResultEntrySystem() {
  const connection = await db.getConnection();
  
  try {
    console.log('\n🔬 ===== SETTING UP RESULT ENTRY SYSTEM =====\n');

    // 1. Add result fields to lab_report_tests table
    console.log('1️⃣ Adding result fields to lab_report_tests table...');
    
    const alterQueries = [
      { query: `ALTER TABLE lab_report_tests ADD COLUMN technician_id INT NULL`, field: 'technician_id' },
      { query: `ALTER TABLE lab_report_tests ADD COLUMN entered_at TIMESTAMP NULL`, field: 'entered_at' },
      { query: `ALTER TABLE lab_report_tests ADD COLUMN technician_notes TEXT NULL`, field: 'technician_notes' }
    ];

    for (const { query, field } of alterQueries) {
      try {
        await connection.query(query);
        console.log(`   ✅ Added field: ${field}`);
      } catch (err) {
        if (err.code === 'ER_DUP_FIELDNAME') {
          console.log(`   ℹ️  Field already exists: ${field}`);
        } else {
          console.log(`   ⚠️  Error adding ${field}: ${err.message}`);
        }
      }
    }

    // 2. Add verification fields to lab_reports table
    console.log('\n2️⃣ Adding verification fields to lab_reports table...');
    
    const reportAlterQueries = [
      { query: `ALTER TABLE lab_reports ADD COLUMN doctor_comments TEXT NULL`, field: 'doctor_comments' },
      { query: `ALTER TABLE lab_reports ADD COLUMN report_pdf_path VARCHAR(500) NULL`, field: 'report_pdf_path' },
      { query: `ALTER TABLE lab_reports ADD COLUMN completed_at TIMESTAMP NULL`, field: 'completed_at' },
      { query: `ALTER TABLE lab_reports ADD COLUMN technician_id INT NULL`, field: 'technician_id' }
    ];

    for (const { query, field } of reportAlterQueries) {
      try {
        await connection.query(query);
        console.log(`   ✅ Added field: ${field}`);
      } catch (err) {
        if (err.code === 'ER_DUP_FIELDNAME') {
          console.log(`   ℹ️  Field already exists: ${field}`);
        } else {
          console.log(`   ⚠️  Error adding ${field}: ${err.message}`);
        }
      }
    }

    // 3. Create technicians table for user management
    console.log('\n3️⃣ Creating technicians table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS lab_technicians (
        technician_id INT AUTO_INCREMENT PRIMARY KEY,
        technician_name VARCHAR(255) NOT NULL,
        employee_id VARCHAR(50) UNIQUE,
        email VARCHAR(255),
        phone VARCHAR(20),
        specialization VARCHAR(100),
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_employee_id (employee_id),
        INDEX idx_is_active (is_active)
      )
    `);
    console.log('   ✅ lab_technicians table created');

    // 4. Add sample technicians
    console.log('\n4️⃣ Adding sample technicians...');
    const sampleTechnicians = [
      {
        technician_name: 'Sarah Johnson',
        employee_id: 'TECH001',
        email: 'sarah.johnson@lab.com',
        phone: '+91-9876543210',
        specialization: 'Clinical Chemistry'
      },
      {
        technician_name: 'Mike Chen',
        employee_id: 'TECH002', 
        email: 'mike.chen@lab.com',
        phone: '+91-9876543211',
        specialization: 'Hematology'
      },
      {
        technician_name: 'Dr. Priya Patel',
        employee_id: 'TECH003',
        email: 'priya.patel@lab.com', 
        phone: '+91-9876543212',
        specialization: 'Microbiology'
      }
    ];

    for (const tech of sampleTechnicians) {
      try {
        await connection.query(`
          INSERT INTO lab_technicians (technician_name, employee_id, email, phone, specialization)
          VALUES (?, ?, ?, ?, ?)
        `, [tech.technician_name, tech.employee_id, tech.email, tech.phone, tech.specialization]);
        console.log(`   ✅ Added: ${tech.technician_name} (${tech.employee_id})`);
      } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          console.log(`   ℹ️  ${tech.technician_name} already exists`);
        } else {
          console.log(`   ⚠️  Error adding ${tech.technician_name}:`, err.message);
        }
      }
    }

    // 5. Update some existing reports to have sample data for testing
    console.log('\n5️⃣ Adding sample result data for testing...');
    
    // Get some existing reports
    const [existingReports] = await connection.query(`
      SELECT report_id FROM lab_reports 
      WHERE status IN ('pending', 'in_progress') 
      LIMIT 3
    `);

    if (existingReports.length > 0) {
      // Update report statuses to create test data
      await connection.query(`
        UPDATE lab_reports 
        SET status = 'in_progress' 
        WHERE report_id = ?
      `, [existingReports[0].report_id]);

      if (existingReports.length > 1) {
        await connection.query(`
          UPDATE lab_reports 
          SET status = 'completed', completed_at = NOW(), technician_id = 1
          WHERE report_id = ?
        `, [existingReports[1].report_id]);

        // Add some sample results
        await connection.query(`
          UPDATE lab_report_tests 
          SET result_value = '85.5', result_status = 'normal', 
              technician_notes = 'Sample processed successfully',
              technician_id = 1, entered_at = NOW()
          WHERE report_id = ? AND test_id = (
            SELECT test_id FROM lab_test_master LIMIT 1
          )
        `, [existingReports[1].report_id]);
      }

      console.log(`   ✅ Updated ${existingReports.length} reports with sample data`);
    }

    // 6. Verify setup
    console.log('\n6️⃣ Verifying setup...');
    
    // Check technicians
    const [techCount] = await connection.query('SELECT COUNT(*) as count FROM lab_technicians');
    console.log(`   ✅ Total technicians: ${techCount[0].count}`);

    // Check reports by status
    const [statusCounts] = await connection.query(`
      SELECT status, COUNT(*) as count 
      FROM lab_reports 
      GROUP BY status
    `);
    
    console.log('   📊 Reports by status:');
    statusCounts.forEach(row => {
      console.log(`     • ${row.status}: ${row.count} reports`);
    });

    // Check result entries
    const [resultCount] = await connection.query(`
      SELECT COUNT(*) as count 
      FROM lab_report_tests 
      WHERE result_value IS NOT NULL
    `);
    console.log(`   ✅ Test results entered: ${resultCount[0].count}`);

    console.log('\n✅ ===== RESULT ENTRY SYSTEM SETUP COMPLETE =====');
    console.log('\n🎯 What\'s ready:');
    console.log('   • Enhanced database schema for result entry');
    console.log('   • Technician management system');
    console.log('   • Result tracking fields');
    console.log('   • Verification workflow support');
    console.log('   • Sample data for testing');
    console.log('\n🚀 Next: Build frontend interfaces for result entry');

  } catch (error) {
    console.error('❌ Error setting up result entry system:', error.message);
  } finally {
    connection.release();
    await db.end();
  }
}

setupResultEntrySystem();