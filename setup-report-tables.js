const db = require('./backend/config/db.config');

async function setupReportTables() {
  const connection = await db.getConnection();
  
  try {
    console.log('\n📊 ===== SETTING UP REPORT GENERATION SYSTEM =====\n');

    // Create lab_reports table
    console.log('1️⃣ Creating lab_reports table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS lab_reports (
        report_id INT AUTO_INCREMENT PRIMARY KEY,
        tenant_id INT DEFAULT 1,
        patient_id INT NOT NULL,
        doctor_id INT NOT NULL,
        report_date DATE NOT NULL,
        sample_collection_date DATE NOT NULL,
        status ENUM('pending', 'in_progress', 'completed', 'verified') DEFAULT 'pending',
        priority ENUM('normal', 'urgent', 'stat') DEFAULT 'normal',
        notes TEXT,
        verified_by INT NULL,
        verified_at TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_tenant_id (tenant_id),
        INDEX idx_patient_id (patient_id),
        INDEX idx_doctor_id (doctor_id),
        INDEX idx_report_date (report_date),
        INDEX idx_status (status),
        FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
        FOREIGN KEY (doctor_id) REFERENCES referring_doctors(doctor_id) ON DELETE CASCADE
      )
    `);
    console.log('✅ lab_reports table created');

    // Create lab_report_tests table (junction table)
    console.log('\n2️⃣ Creating lab_report_tests table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS lab_report_tests (
        report_test_id INT AUTO_INCREMENT PRIMARY KEY,
        report_id INT NOT NULL,
        test_id INT NOT NULL,
        result_value VARCHAR(255) NULL,
        result_status ENUM('normal', 'abnormal', 'critical') DEFAULT 'normal',
        result_notes TEXT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_report_id (report_id),
        INDEX idx_test_id (test_id),
        FOREIGN KEY (report_id) REFERENCES lab_reports(report_id) ON DELETE CASCADE,
        FOREIGN KEY (test_id) REFERENCES lab_test_master(test_id) ON DELETE CASCADE,
        UNIQUE KEY unique_report_test (report_id, test_id)
      )
    `);
    console.log('✅ lab_report_tests table created');

    // Insert sample reports
    console.log('\n3️⃣ Adding sample reports...');
    
    // First, get some sample data
    const [patients] = await connection.query('SELECT id as patient_id FROM patients LIMIT 3');
    const [doctors] = await connection.query('SELECT doctor_id FROM referring_doctors LIMIT 3');
    const [tests] = await connection.query('SELECT test_id FROM lab_test_master LIMIT 5');

    if (patients.length > 0 && doctors.length > 0 && tests.length > 0) {
      const sampleReports = [
        {
          patient_id: patients[0].patient_id,
          doctor_id: doctors[0].doctor_id,
          report_date: '2024-12-11',
          sample_collection_date: '2024-12-10',
          status: 'completed',
          priority: 'normal',
          notes: 'Routine health checkup'
        },
        {
          patient_id: patients[1] ? patients[1].patient_id : patients[0].patient_id,
          doctor_id: doctors[1] ? doctors[1].doctor_id : doctors[0].doctor_id,
          report_date: '2024-12-11',
          sample_collection_date: '2024-12-11',
          status: 'pending',
          priority: 'urgent',
          notes: 'Follow-up tests required'
        },
        {
          patient_id: patients[2] ? patients[2].patient_id : patients[0].patient_id,
          doctor_id: doctors[2] ? doctors[2].doctor_id : doctors[0].doctor_id,
          report_date: '2024-12-09',
          sample_collection_date: '2024-12-09',
          status: 'verified',
          priority: 'normal',
          notes: 'Pre-operative screening'
        }
      ];

      for (let i = 0; i < sampleReports.length; i++) {
        const report = sampleReports[i];
        
        try {
          const [reportResult] = await connection.query(`
            INSERT INTO lab_reports (
              patient_id, doctor_id, report_date, sample_collection_date,
              status, priority, notes
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
          `, [
            report.patient_id,
            report.doctor_id,
            report.report_date,
            report.sample_collection_date,
            report.status,
            report.priority,
            report.notes
          ]);

          const reportId = reportResult.insertId;

          // Add 2-3 tests to each report
          const testCount = Math.min(3, tests.length);
          for (let j = 0; j < testCount; j++) {
            await connection.query(`
              INSERT INTO lab_report_tests (report_id, test_id, result_value, result_status)
              VALUES (?, ?, ?, ?)
            `, [
              reportId,
              tests[j].test_id,
              report.status === 'verified' ? '85.5' : null,
              report.status === 'verified' ? 'normal' : 'normal'
            ]);
          }

          console.log(`   ✅ Added sample report #${reportId}`);
        } catch (err) {
          if (err.code === 'ER_DUP_ENTRY') {
            console.log(`   ℹ️  Sample report ${i + 1} already exists`);
          } else {
            console.log(`   ⚠️  Error adding sample report ${i + 1}:`, err.message);
          }
        }
      }
    } else {
      console.log('   ⚠️  No sample data available (patients, doctors, or tests missing)');
      console.log('   💡 Run setup scripts for patients, doctors, and tests first');
    }

    // Verify setup
    console.log('\n4️⃣ Verifying setup...');
    const [reportCount] = await connection.query('SELECT COUNT(*) as count FROM lab_reports');
    const [testCount] = await connection.query('SELECT COUNT(*) as count FROM lab_report_tests');
    
    console.log(`   ✅ Total reports: ${reportCount[0].count}`);
    console.log(`   ✅ Total report tests: ${testCount[0].count}`);

    // Show sample data
    const [sampleReports] = await connection.query(`
      SELECT 
        lr.report_id,
        lr.status,
        lr.priority,
        p.patient_name,
        d.doctor_name,
        COUNT(lrt.test_id) as test_count
      FROM lab_reports lr
      LEFT JOIN patients p ON lr.patient_id = p.id
      LEFT JOIN referring_doctors d ON lr.doctor_id = d.doctor_id
      LEFT JOIN lab_report_tests lrt ON lr.report_id = lrt.report_id
      GROUP BY lr.report_id
      ORDER BY lr.report_id
      LIMIT 5
    `);

    if (sampleReports.length > 0) {
      console.log('\n📋 Sample reports in system:');
      sampleReports.forEach(report => {
        console.log(`   • Report #${report.report_id}: ${report.patient_name} → ${report.doctor_name} (${report.test_count} tests) [${report.status.toUpperCase()}]`);
      });
    }

    console.log('\n✅ ===== REPORT GENERATION SYSTEM READY =====');
    console.log('\n🎯 Features available:');
    console.log('   • Generate reports for patients');
    console.log('   • Select multiple tests per report');
    console.log('   • Track report status (pending → in_progress → completed → verified)');
    console.log('   • Doctor verification workflow');
    console.log('   • Priority levels (normal, urgent, STAT)');
    console.log('   • Sample collection date tracking');
    console.log('   • Test result entry');
    console.log('   • Report statistics and filtering');
    console.log('\n🚀 Next: Restart backend and visit http://localhost:3000/reports');

  } catch (error) {
    console.error('❌ Error setting up report tables:', error.message);
  } finally {
    connection.release();
    await db.end();
  }
}

setupReportTables();