const db = require('./backend/config/db.config');

async function setupDoctorTables() {
  const connection = await db.getConnection();
  
  try {
    console.log('\n🏥 Setting up Doctor Management Tables...\n');

    // Create referring_doctors table
    console.log('📝 Creating referring_doctors table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS referring_doctors (
        doctor_id INT AUTO_INCREMENT PRIMARY KEY,
        tenant_id INT DEFAULT 1,
        doctor_name VARCHAR(255) NOT NULL,
        specialization VARCHAR(100),
        qualification VARCHAR(255),
        registration_number VARCHAR(100),
        contact_number VARCHAR(20),
        email VARCHAR(255),
        address TEXT,
        commission_type ENUM('none', 'percentage', 'fixed') DEFAULT 'none',
        commission_value DECIMAL(10,2) DEFAULT 0.00,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_tenant_id (tenant_id),
        INDEX idx_doctor_name (doctor_name),
        INDEX idx_specialization (specialization),
        INDEX idx_is_active (is_active)
      )
    `);
    console.log('✅ referring_doctors table created');

    // Create doctor_commissions table
    console.log('📝 Creating doctor_commissions table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS doctor_commissions (
        commission_id INT AUTO_INCREMENT PRIMARY KEY,
        tenant_id INT DEFAULT 1,
        doctor_id INT NOT NULL,
        invoice_id INT,
        test_amount DECIMAL(10,2) NOT NULL,
        commission_amount DECIMAL(10,2) NOT NULL,
        commission_date DATE NOT NULL,
        payment_status ENUM('pending', 'paid') DEFAULT 'pending',
        payment_date DATE NULL,
        payment_mode VARCHAR(50),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (doctor_id) REFERENCES referring_doctors(doctor_id) ON DELETE CASCADE,
        INDEX idx_tenant_id (tenant_id),
        INDEX idx_doctor_id (doctor_id),
        INDEX idx_commission_date (commission_date),
        INDEX idx_payment_status (payment_status)
      )
    `);
    console.log('✅ doctor_commissions table created');

    // Insert sample doctors
    console.log('📝 Adding sample doctors...');
    
    const sampleDoctors = [
      {
        doctor_name: 'Dr. Rajesh Kumar',
        specialization: 'Cardiology',
        qualification: 'MD, DM (Cardiology)',
        registration_number: 'MCI12345',
        contact_number: '+91-9876543210',
        email: 'dr.rajesh@hospital.com',
        address: '123 Medical Street, City Hospital, Mumbai',
        commission_type: 'percentage',
        commission_value: 10.00
      },
      {
        doctor_name: 'Dr. Priya Sharma',
        specialization: 'Neurology',
        qualification: 'MD, DM (Neurology)',
        registration_number: 'MCI67890',
        contact_number: '+91-9876543211',
        email: 'dr.priya@neuro.com',
        address: '456 Brain Care Center, Delhi',
        commission_type: 'percentage',
        commission_value: 8.00
      },
      {
        doctor_name: 'Dr. Amit Patel',
        specialization: 'Orthopedics',
        qualification: 'MS (Orthopedics)',
        registration_number: 'MCI11111',
        contact_number: '+91-9876543212',
        email: 'dr.amit@bones.com',
        address: '789 Bone & Joint Clinic, Ahmedabad',
        commission_type: 'fixed',
        commission_value: 500.00
      },
      {
        doctor_name: 'Dr. Sunita Reddy',
        specialization: 'Pediatrics',
        qualification: 'MD (Pediatrics)',
        registration_number: 'MCI22222',
        contact_number: '+91-9876543213',
        email: 'dr.sunita@kids.com',
        address: '321 Children Hospital, Hyderabad',
        commission_type: 'percentage',
        commission_value: 12.00
      },
      {
        doctor_name: 'Dr. Vikram Singh',
        specialization: 'General',
        qualification: 'MBBS, MD',
        registration_number: 'MCI33333',
        contact_number: '+91-9876543214',
        email: 'dr.vikram@general.com',
        address: '654 General Clinic, Jaipur',
        commission_type: 'none',
        commission_value: 0.00
      }
    ];

    for (const doctor of sampleDoctors) {
      try {
        await connection.query(`
          INSERT INTO referring_doctors (
            doctor_name, specialization, qualification, registration_number,
            contact_number, email, address, commission_type, commission_value
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          doctor.doctor_name,
          doctor.specialization,
          doctor.qualification,
          doctor.registration_number,
          doctor.contact_number,
          doctor.email,
          doctor.address,
          doctor.commission_type,
          doctor.commission_value
        ]);
        console.log(`   ✅ Added: ${doctor.doctor_name}`);
      } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          console.log(`   ℹ️  ${doctor.doctor_name} already exists`);
        } else {
          console.log(`   ⚠️  Error adding ${doctor.doctor_name}:`, err.message);
        }
      }
    }

    // Verify setup
    console.log('\n📊 Verifying setup...');
    const [doctorCount] = await connection.query('SELECT COUNT(*) as count FROM referring_doctors');
    console.log(`   ✅ Total doctors: ${doctorCount[0].count}`);

    const [doctors] = await connection.query(`
      SELECT doctor_name, specialization, commission_type, commission_value 
      FROM referring_doctors 
      ORDER BY doctor_name
    `);
    
    console.log('\n👨‍⚕️ Doctors in system:');
    doctors.forEach(doctor => {
      const commission = doctor.commission_type === 'none' 
        ? 'No commission' 
        : `${doctor.commission_value}${doctor.commission_type === 'percentage' ? '%' : ' ₹'}`;
      console.log(`   • ${doctor.doctor_name} (${doctor.specialization}) - ${commission}`);
    });

    console.log('\n✅ Doctor Management System Ready!\n');
    console.log('🎯 Features available:');
    console.log('   • Add/Edit/Delete doctors');
    console.log('   • Specialization management');
    console.log('   • Commission tracking');
    console.log('   • Referral statistics');
    console.log('   • Commission reports');
    console.log('\n🚀 Next: Restart backend and test at http://localhost:3000/doctors');

  } catch (error) {
    console.error('❌ Error setting up doctor tables:', error.message);
  } finally {
    connection.release();
    await db.end();
  }
}

setupDoctorTables();