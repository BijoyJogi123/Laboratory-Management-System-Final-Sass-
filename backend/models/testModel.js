const db = require('../config/db.config');

// Create the 'tests' table schema
const createTestTable = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS lab_items (
      item_id INT AUTO_INCREMENT PRIMARY KEY,
      department VARCHAR(255) NOT NULL,
      item_name VARCHAR(255) NOT NULL,
      price DECIMAL(10, 2) NOT NULL,
      tax_slab DECIMAL(5, 2) NOT NULL,
      unit VARCHAR(50) NOT NULL,
      ref_value VARCHAR(255) NOT NULL,
      related_test VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log('Tests table created or exists already.');
  });
};

// // Add a new test to the database
// const addTest = (item_name, price, tax_slab, unit, ref_value, callback) => {
//   const sql = `INSERT INTO lab_items (item_name, price, tax_slab, unit, ref_value) VALUES (?, ?, ?, ?, ?)`;
//   db.query(sql, [item_name, price, tax_slab, unit, ref_value], (err, result) => {
//     if (err) return callback(err);
//     callback(null, result);
//   });
// };

const addItem = (department,item_name, price, tax_slab, unit, ref_value, related_test, callback) => {
  const sql = `INSERT INTO lab_items (department,item_name, price, tax_slab, unit, ref_value, related_test) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  db.query(sql, [department,item_name, price, tax_slab, unit, ref_value, related_test], (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};


// Add a new test to the database
const addTest = (test_name, unit, ref_value, callback) => {
  const sql = `INSERT INTO lab_test_master (test_name,  unit, ref_value) VALUES (  ?, ?, ?)`;
  db.query(sql, [test_name, unit, ref_value], (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};


// Fetch all tests from the database
// const getAllTests = (callback) => {
//   const sql = `SELECT * FROM lab_items ORDER BY item_id ASC`;
//   db.query(sql, (err, results) => {
//     if (err) return callback(err);
//     callback(null, results);
//   });
// };

const getAllitems = (callback) => {
  const sql = `SELECT * FROM lab_items ORDER BY item_id ASC`;
  db.query(sql, (err, results) => {
    if (err) return callback(err);
    callback(null, results);
  });
};

const getAllTests = (callback) => {
  const sql = `SELECT * FROM lab_test_master ORDER BY test_id ASC`;
  db.query(sql, (err, results) => {
    if (err) return callback(err);
    callback(null, results);
  });
};




// Fetch a single test by item_id
const getTestById = (item_id, callback) => {
  const sql = `SELECT * FROM lab_items WHERE item_id = ?`;
  db.query(sql, [item_id], (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

// // Update a test by item_id
// const updateTest = (item_id, item_name, price, tax_slab, unit, ref_value, callback) => {
//   const sql = `UPDATE lab_items SET item_name = ?, price = ?, tax_slab = ?, unit = ?, ref_value = ? WHERE item_id = ?`;
//   db.query(sql, [item_name, price, tax_slab, unit, ref_value, item_id], (err, result) => {
//     if (err) return callback(err);
//     callback(null, result);
//   });
// };


// Update a test by item_id

const updateItem = (item_id, item_name, price, tax_slab, unit, ref_value, related_test, callback) => {
  let sql = 'UPDATE lab_items SET';
  const values = [];

  // Dynamically build the SQL query based on the provided parameters
  if (item_name !== undefined) {
    sql += ' item_name = ?,';
    values.push(item_name);
  }
  if (price !== undefined) {
    sql += ' price = ?,';
    values.push(price);
  }

  if (tax_slab !== undefined) {
    sql += ' tax_slab = ?,';
    values.push(price);
  }
  if (unit !== undefined) {
    sql += ' unit = ?,';
    values.push(unit);
  }
  if (ref_value !== undefined) {
    sql += ' ref_value = ?,';
    values.push(ref_value);
  }
  if (related_test !== undefined) {
    sql += ' related_test = ?,';
    values.push(related_test);
  }

  // Remove the last comma
  sql = sql.slice(0, -1);

  sql += ' WHERE item_id = ?';
  values.push(item_id);

  // Execute the query
  db.query(sql, values, (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};




// Update a test by test_id
const updateTest = (test_id, test_name, unit, ref_value, callback) => {
  const sql = `UPDATE lab_test_master SET test_name = ?, unit = ?, ref_value = ? WHERE test_id = ?`;
  db.query(sql, [test_name, unit, ref_value, test_id], (err, result) => {

    if (err) return callback(err);
    callback(null, result);
  });
};


// Delete a Item by item_id
const deleteItem = (item_id, callback) => {
  const sql = `DELETE FROM lab_items WHERE item_id = ?`;
  db.query(sql, [item_id], (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};


// Delete a test by test_id
const deleteTest = (test_id, callback) => {
  const sql = `DELETE FROM lab_test_master WHERE test_id = ?`;
  db.query(sql, [test_id], (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

module.exports = {
  createTestTable,
  addTest,
  addItem,
  getAllTests,
  getTestById,
  updateItem,
  updateTest,
  deleteItem,
  deleteTest,
  getAllitems
};