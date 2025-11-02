const db = require('../config/db.config');

// Create the 'lab_sales' table schema

const create_lab_sales_table = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS lab_sales (
      sales_id INT AUTO_INCREMENT PRIMARY KEY,
      patient_type ENUM('inpatient', 'outpatient') NOT NULL,
      addm_id VARCHAR(100) DEFAULT NULL,
      patient_name VARCHAR(255) NOT NULL,
      state VARCHAR(100) NOT NULL,
      patient_contact VARCHAR(15) NOT NULL,  
      gender ENUM('male', 'female', 'other') NOT NULL,
      age INT NOT NULL,
      blood_group VARCHAR(10) NOT NULL,
      ref_doctor VARCHAR(255) NOT NULL, 
      patient_address TEXT NOT NULL,
      state VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      invoice_id VARCHAR(255) NOT NULL
    );
  `;
  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log('lab_sales table created or exists already.');
  });
};


// const create_lab_sales_table = () => {
//   const sql = `
//     CREATE TABLE IF NOT EXISTS lab_sales (
//       sales_id INT AUTO_INCREMENT PRIMARY KEY,
//       patient_type ENUM('inpatient', 'outpatient') NOT NULL,
//       addm_id VARCHAR(100) DEFAULT NULL,
//       patient_name VARCHAR(255) NOT NULL,
//       state VARCHAR(100) NOT NULL,
//       patient_contact VARCHAR(15) NOT NULL,  
//       gender ENUM('male', 'female', 'other') NOT NULL,
//       age INT NOT NULL,
//       blood_group VARCHAR(10) NOT NULL,
//       ref_doctor VARCHAR(255) NOT NULL, 
//       patient_address TEXT NOT NULL,
//       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//       invoice_id VARCHAR(255) NOT NULL
//     );
//   `;

//   db.query(sql, (err, result) => {
//     if (err) throw err;
//     console.log('lab_sales table created or exists already.');

//     // Drop the trigger if it already exists
//     const dropTriggerSql = `DROP TRIGGER IF EXISTS generate_invoice_id;`;

//     db.query(dropTriggerSql, (err, result) => {
//       if (err) throw err;
//       console.log('Existing trigger (if any) dropped.');

//       // Now create the trigger again
//       const triggerSql = `
//         CREATE TRIGGER generate_invoice_id
//         BEFORE INSERT ON lab_sales
//         FOR EACH ROW
//         BEGIN
//           SET NEW.invoice_id = CONCAT('INV-', DATE_FORMAT(NOW(), '%Y%m%d'), '-', LPAD(NEW.sales_id, 5, '0'));
//         END;
//       `;

//       db.query(triggerSql, (err, result) => {
//         if (err) throw err;
//         console.log('Trigger for invoice_id created.');
//       });
//     });
//   });
// };


// Create the 'lab_sales_items' table schema




const create_lab_sales_items_table = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS lab_sales_items (
      sales_item_id INT AUTO_INCREMENT PRIMARY KEY,  -- Primary Key for items
      sales_id INT,                            -- Foreign Key, refers to lab_sales
      item_id INT ,
      is_package BOOLEAN DEFAULT FALSE,
      price DECIMAL(10, 2) NOT NULL,
      total_price DECIMAL(10, 2) NOT NULL,
      dis_perc DECIMAL(10, 2) NOT NULL,
      dis_value DECIMAL(10, 2) NOT NULL,
      tax_perc DECIMAL(10, 2) NOT NULL,
      tax_value DECIMAL(10, 2) NOT NULL,
      status VARCHAR(255) NOT NULL DEFAULT 'in-progress',
      doctor_remark VARCHAR(1000)  NULL,
      doctor_sign LONGBLOB  NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log('lab_sales_items table created or exists already.');
  });
};

// Add a new patient and tests for the patient
const addPatient = (patientData, testItems, callback) => {
  const {
    patient_type, addm_id, patient_name, state,
    patient_contact, gender, age, blood_group,
    ref_doctor, patient_address, invoice_id, payment_type, total_payment
  } = patientData;

  // Insert patient details into the lab_sales table
  const sql = `INSERT INTO lab_sales 
                 (patient_type, addm_id, patient_name, state, patient_contact, gender, age, blood_group, ref_doctor, patient_address,invoice_id,payment_type,total_payment) 
               VALUES 
                 (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(sql, [
    patient_type, addm_id, patient_name, state, patient_contact,
    gender, age, blood_group, ref_doctor, patient_address, invoice_id, payment_type, total_payment
  ], (err, result) => {
    if (err) return callback(err);

    const salesId = result.insertId; // Get the auto-generated sales_id

    // If there are test items provided, insert them into lab_sales_items
    if (testItems && testItems.length > 0) {
      const testSql = `INSERT INTO lab_sales_items 
                       (sales_id, item_id, price,total_price, dis_perc, dis_value, tax_perc, tax_value) 
                       VALUES ?`;

      // Map the test items to match the lab_sales_items schema
      const testValues = testItems.map(test => [
        salesId, test.item_id, test.price, test.total_price || 0,
        test.dis_perc || 0, test.dis_value || 0, test.tax_perc || 0, test.tax_value || 0
      ]);

      // Execute the batch insert for all test items
      db.query(testSql, [testValues], (testErr) => {
        if (testErr) return callback(testErr);
        callback(null, result);
      });
    } else {
      callback(null, result);
    }
  });
};


// Fetch all patients
const getAllPatients = (callback) => {
  const sql = `SELECT * FROM lab_sales ORDER BY created_at ASC`;
  db.query(sql, (err, results) => {
    if (err) return callback(err);
    callback(null, results);
  });
};



// Fetch single patient from lab_sales table

const getPatientById = (sales_id, callback) => {
  // Validate that lab_sales_id is provided
  if (!sales_id) {
    return callback(new Error('Lab Sales ID is required'));
  }

  // SQL query to get patient information from lab_sales
  const getPatientSQL = `
    SELECT * 
    FROM lab_sales 
    WHERE sales_id = ?;
  `;

  // Execute the query
  db.query(getPatientSQL, [sales_id], (err, result) => {
    if (err) {
      return callback(err); // Return the error if query fails
    }

    // Check if any record was found
    if (result.length === 0) {
      return callback(new Error('No patient found with this Lab Sales ID'));
    }

    // Return the patient data
    callback(null, result[0]);
  });
};


// Fetch all patients with test details
const getAllPatientsTests = (callback) => {
  const sql = `
  SELECT 
    lab_sales_items.sales_item_id, 
    lab_sales_items.sales_id, 
    lab_sales_items.item_id, 
    lab_sales_items.total_price,
    lab_sales_items.price, 
    lab_sales_items.dis_perc, 
    lab_sales_items.dis_value, 
    lab_sales_items.tax_perc, 
    lab_sales_items.tax_value, 
    lab_sales_items.created_at, 
    lab_sales_items.status,
    lab_sales_items.doctor_remark,
    lab_sales_items.doctor_sign,  
    lab_sales.payment_type, 
    lab_sales.patient_name,  -- Join to get patient name
    lab_items.department,
    lab_items.item_name       -- Join to get item name
  FROM 
    lab_sales_items 
  JOIN 
    lab_sales 
  ON 
    lab_sales_items.sales_id = lab_sales.sales_id 
  JOIN 
    lab_items
  ON
    lab_sales_items.item_id = lab_items.item_id
  ORDER BY 
    lab_sales_items.created_at ASC 
`;
  db.query(sql, (err, results) => {
    if (err) return callback(err);
    callback(null, results);
  });
};

// Fetch patient by ID and their tests

const getPatientTestById = (sales_id, callback) => {
  const sql = `
    SELECT 
      ls.patient_name, 
      ls.state, 
      ls.patient_contact, 
      ls.gender, 
      ls.age,
      ls.state,
      ls.blood_group, 
      ls.ref_doctor,
      ls.addm_id, 
      ls.patient_address, 
      ls.invoice_id,
      ls.payment_type,
      ls.total_payment,
      lsi.sales_item_id, 
      lsi.sales_id, 
      lsi.item_id, 
      lsi.total_price, 
      lsi.price, 
      lsi.dis_perc, 
      lsi.dis_value, 
      lsi.tax_perc, 
      lsi.tax_value, 
      lsi.created_at, 
      lsi.status,
      lsi.doctor_remark,
      lsi.doctor_sign,
      t.department,  
      t.item_name       -- Get the item (test) name from lab_items
    FROM 
      lab_sales ls
    LEFT JOIN 
      lab_sales_items lsi 
    ON 
      ls.sales_id = lsi.sales_id
    LEFT JOIN 
      lab_items t 
    ON 
      lsi.item_id = t.item_id
    WHERE 
      ls.sales_id = ?;  -- Fetch data for the specific sales_id
  `;

  db.query(sql, [sales_id], (err, result) => {
    if (err) return callback(err);
    callback(null, result);  // Return the result (patient and associated tests)
  });
};



// Update patient details and their test items

// const updatePatient = (sales_id, updatedPatientData, callback) => {
//   const {
//     patient_type, addm_id, patient_name, state,
//     patient_contact, gender, age, blood_group,
//     ref_doctor, patient_address
//   } = updatedPatientData;

//   const sql = `UPDATE lab_sales 
//                SET patient_type = ?, addm_id = ?, patient_name = ?, state = ?, patient_contact = ?, 
//                    gender = ?, age = ?, blood_group = ?, ref_doctor = ?, patient_address = ?
//                WHERE sales_id = ?`;

//   db.query(sql, [
//     patient_type, addm_id, patient_name, state, patient_contact,
//     gender, age, blood_group, ref_doctor, patient_address, sales_id
//   ], (err, result) => {
//     if (err) return callback(err);

//     // Only update the patient data, so no need to touch lab_sales_items
//     callback(null, result);
//   });
// };

const updatePatient = (sales_id, updatedPatientData, callback) => {
  // Destructure only the properties that might be updated
  const {
    patient_type, addm_id, patient_name, state,
    patient_contact, gender, age, blood_group,
    ref_doctor, patient_address, invoice_id
  } = updatedPatientData;

  // Start building the SQL query and parameters
  let sql = 'UPDATE lab_sales SET ';
  let params = [];

  // Check which fields are provided and add them to the query
  if (patient_type !== undefined) {
    sql += 'patient_type = ?, ';
    params.push(patient_type);
  }
  if (addm_id !== undefined) {
    sql += 'addm_id = ?, ';
    params.push(addm_id);
  }
  if (patient_name !== undefined) {
    sql += 'patient_name = ?, ';
    params.push(patient_name);
  }
  if (state !== undefined) {
    sql += 'state = ?, ';
    params.push(state);
  }
  if (patient_contact !== undefined) {
    sql += 'patient_contact = ?, ';
    params.push(patient_contact);
  }
  if (gender !== undefined) {
    sql += 'gender = ?, ';
    params.push(gender);
  }
  if (age !== undefined) {
    sql += 'age = ?, ';
    params.push(age);
  }
  if (blood_group !== undefined) {
    sql += 'blood_group = ?, ';
    params.push(blood_group);
  }
  if (ref_doctor !== undefined) {
    sql += 'ref_doctor = ?, ';
    params.push(ref_doctor);
  }
  if (patient_address !== undefined) {
    sql += 'patient_address = ?, ';
    params.push(patient_address);
  }
  if (invoice_id !== undefined) {
    sql += 'invoice_id = ?, ';
    params.push(invoice_id);
  }

  // Remove trailing comma and space from the query
  sql = sql.slice(0, -2);

  // Add WHERE clause for sales_id
  sql += ' WHERE sales_id = ?';
  params.push(sales_id);

  // Execute the query
  db.query(sql, params, (err, result) => {
    if (err) return callback(err);

    callback(null, result);
  });
};
// Delete patient and their test items
// const deletePatient = (sales_id, callback) => {
//   const deleteTestsSql = `DELETE FROM lab_sales_items WHERE sales_id = ?`;

//   db.query(deleteTestsSql, [sales_id], (testErr) => {
//     if (testErr) return callback(testErr);

//     const deletePatientSql = `DELETE FROM lab_sales WHERE sales_id = ?`;

//     db.query(deletePatientSql, [sales_id], (patientErr, result) => {
//       if (patientErr) return callback(patientErr);
//       callback(null, result);
//     });
//   });
// };

const deletePatient = (sales_id, callback) => {
  const deleteLabReportSql = `DELETE FROM lab_report WHERE sales_item_id IN (SELECT sales_item_id FROM lab_sales_items WHERE sales_id = ?)`;

  // First, delete related lab_report entries
  db.query(deleteLabReportSql, [sales_id], (reportErr) => {
    if (reportErr) return callback(reportErr);

    const deleteTestsSql = `DELETE FROM lab_sales_items WHERE sales_id = ?`;

    // Then, delete related lab_sales_items
    db.query(deleteTestsSql, [sales_id], (testErr) => {
      if (testErr) return callback(testErr);

      const deletePatientSql = `DELETE FROM lab_sales WHERE sales_id = ?`;

      // Finally, delete the patient from lab_sales
      db.query(deletePatientSql, [sales_id], (patientErr, result) => {
        if (patientErr) return callback(patientErr);
        callback(null, result); // If everything is successful
      });
    });
  });
};




// Update doctor_remark (or any other fields if needed)
const updateLabSalesItem = (id, data, callback) => {
  const sql = `UPDATE lab_sales_items 
                 SET ? 
                 WHERE sales_item_id = ?`;
  db.query(sql, [data, id], (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(null, result);
  });
}



module.exports = {
  create_lab_sales_table,
  create_lab_sales_items_table,
  addPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  deletePatient,
  updateLabSalesItem,
  getPatientTestById,
  //patient tests sales 
  getAllPatientsTests
};
