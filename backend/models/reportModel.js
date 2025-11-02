const db = require('../config/db.config');


// Create the lab_report table if it doesn't exist
const createLabReportTable = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS lab_report (
      report_id INT AUTO_INCREMENT PRIMARY KEY,
      sales_item_id INT NULL,
      test_id INT NULL,
     test_name VARCHAR(255) NULL,
      results VARCHAR(255),
      unit VARCHAR(50),
      ref_value VARCHAR(255),
      FOREIGN KEY (sales_item_id) REFERENCES lab_sales_items(sales_item_id),
      FOREIGN KEY (test_id) REFERENCES lab_test_master(test_id),
      reported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error creating lab_report table:', err);
    } else {
      console.log('lab_report table created or exists already.');
    }
  });
};


// Create the lab_test_master table if it doesn't exist
const createLabTestMasterTable = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS lab_test_master (
      test_id INT ,
      test_name VARCHAR(255) NULL,
      unit VARCHAR(50),
      ref_value VARCHAR(255),
      pack_id INT DEFAULT NULL -- New field to indicate if this test is part of a package
    );
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error creating lab_test_master table:', err);
    } else {
      console.log('lab_test_master table created or exists already.');
    }
  });
};



// Insert test results for a given sales_item
// const submitReport = (reportData, callback) => {
//   const { sales_item_id, testReports } = reportData;

//   // Validate that sales_item_id is present
//   if (!sales_item_id) {
//     return callback(new Error('Sales Item ID is required'));
//   }

//   // Prepare SQL statements
//   const insertTestSQL = `
//     INSERT INTO lab_test_master (test_name, unit, ref_value, pack_id) 
//     VALUES (?, ?, ?, ?) 
//     ON DUPLICATE KEY UPDATE test_id=LAST_INSERT_ID(test_id); -- If the test exists, get its ID
//   `;

//   const insertReportSQL = `
//     INSERT INTO lab_report (sales_item_id, test_id, results, unit, ref_value) 
//     VALUES (?, ?, ?, ?, ?);
//   `;

//   // Create an array of promises for inserting reports
//   const reportPromises = testReports.map((report) => {
//     const { test_name, results, unit, ref_value, pack_id } = report; // Assuming pack_id is provided

//     return new Promise((resolve, reject) => {
//       // Insert the test into lab_test_master
//       db.query(insertTestSQL, [test_name, unit, ref_value, pack_id], (err, testResult) => {
//         if (err) {
//           return reject(err); // If any query fails, reject the promise
//         }

//         const test_id = testResult.insertId; // Get the ID of the newly inserted or existing test

//         // Now insert the report into lab_report
//         db.query(insertReportSQL, [sales_item_id, test_id, results, unit, ref_value], (err) => {
//           if (err) {
//             return reject(err); // If any query fails, reject the promise
//           }
//           resolve(); // Resolve the promise if the query is successful
//         });
//       });
//     });
//   });

//   // Use Promise.all to wait for all queries to complete
//   Promise.all(reportPromises)
//     .then(() => {
//       callback(null, { message: 'Report submitted successfully' });
//     })
//     .catch((err) => {
//       callback(err); // If any query fails, send the error
//     });
// };

// Insert test results for a given sales_item
const submitReport = (reportData, callback) => {
  const { sales_item_id, testReports } = reportData;

  // Validate that sales_item_id is present
  if (!sales_item_id) {
    return callback(new Error('Sales Item ID is required'));
  }

  // Prepare SQL statement for inserting reports into lab_report
  const insertReportSQL = `
    INSERT INTO lab_report (sales_item_id, test_id, results, unit, ref_value) 
    VALUES (?, ?, ?, ?, ?);
  `;

  // Create an array of promises for inserting reports
  const reportPromises = testReports.map((report) => {
    const { test_id, results, unit, ref_value } = report; // test_id will be provided in the report

    return new Promise((resolve, reject) => {
      // Insert the report into lab_report
      db.query(insertReportSQL, [sales_item_id, test_id, results, unit, ref_value], (err) => {
        if (err) {
          return reject(err); // If any query fails, reject the promise
        }
        resolve(); // Resolve the promise if the query is successful
      });
    });
  });

  // Use Promise.all to wait for all queries to complete
  Promise.all(reportPromises)
    .then(() => {
      callback(null, { message: 'Report submitted successfully' });
    })
    .catch((err) => {
      callback(err); // If any query fails, send the error
    });
};








// Fetch report details for a sales_item_id or pack_id
// Fetch report details for a sales_item_id
const getReportBySalesItemId = (sales_item_id, callback) => {
  const sql = `
    SELECT 
      lr.report_id, 
      lr.sales_item_id, 
      lr.test_id, 
      lr.results, 
      lr.reported_at,
      ltm.test_name, 
      ltm.unit, 
      ltm.ref_value
    FROM lab_report lr
    LEFT JOIN lab_test_master ltm ON lr.test_id = ltm.test_id
    WHERE lr.sales_item_id = ?;
  `;

  db.query(sql, [sales_item_id], (err, results) => {
    if (err) {
      return callback(err);
    }
    callback(null, results);
  });
};

//This is for getting Specific  Tests from lab_test_master

const getTestsByIds = (testIds, callback) => {
  const sql = `
    SELECT * 
    FROM lab_test_master 
    WHERE test_id IN (?)
  `;

  db.query(sql, [testIds], (err, results) => {
    if (err) {
      return callback(err);
    }
    callback(null, results);
  });
};


// Export the functions to be used in other files
// Export the functions to be used in other files
// Export the functions to be used in other files
module.exports = {
  createLabReportTable,
  createLabTestMasterTable,
  submitReport,
  getReportBySalesItemId,
  getTestsByIds
};