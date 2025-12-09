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
const addTest = async (test_name, unit, ref_value) => {
  const sql = `INSERT INTO lab_test_master (test_name, unit, ref_value) VALUES (?, ?, ?)`;
  const [result] = await db.query(sql, [test_name, unit, ref_value]);
  return result;
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

const getAllTests = async () => {
  const sql = `SELECT * FROM lab_test_master ORDER BY test_id DESC`;
  const [results] = await db.query(sql);
  return results;
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
const updateTest = async (test_id, test_name, unit, ref_value) => {
  const sql = `UPDATE lab_test_master SET test_name = ?, unit = ?, ref_value = ? WHERE test_id = ?`;
  const [result] = await db.query(sql, [test_name, unit, ref_value, test_id]);
  return result;
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
const deleteTest = async (test_id) => {
  const sql = `DELETE FROM lab_test_master WHERE test_id = ?`;
  const [result] = await db.query(sql, [test_id]);
  return result;
};

// Add single test (new function for group tests feature)
const addTestNew = async (testData) => {
  const { test_name, unit, ref_value, price } = testData;

  const [result] = await db.query(
    'INSERT INTO lab_test_master (test_name, unit, ref_value, test_type, price) VALUES (?, ?, ?, "single", ?)',
    [test_name, unit || null, ref_value || null, price || 0]
  );

  const [newTest] = await db.query('SELECT * FROM lab_test_master WHERE test_id = ?', [result.insertId]);
  return newTest[0];
};

// Add group test with sub-tests (new function)
const addGroupTest = async (testData) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const { test_name, price, subTests } = testData;
    
    // Create parent group test
    const [groupResult] = await connection.query(
      'INSERT INTO lab_test_master (test_name, test_type, price) VALUES (?, "group", ?)',
      [test_name, price || 0]
    );
    
    const groupId = groupResult.insertId;
    
    // Create sub-tests
    if (subTests && subTests.length > 0) {
      for (const subTest of subTests) {
        await connection.query(
          'INSERT INTO lab_test_master (test_name, unit, ref_value, test_type, parent_test_id, price) VALUES (?, ?, ?, "single", ?, 0)',
          [subTest.name, subTest.unit || null, subTest.ref_value || null, groupId]
        );
      }
    }
    
    await connection.commit();
    
    // Return the created group test with sub-tests
    const [groupTest] = await connection.query('SELECT * FROM lab_test_master WHERE test_id = ?', [groupId]);
    const [subTestsResult] = await connection.query('SELECT * FROM lab_test_master WHERE parent_test_id = ?', [groupId]);
    
    return {
      ...groupTest[0],
      subTests: subTestsResult
    };
    
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

// Get all tests with sub-tests for groups (enhanced function)
const getAllTestsNew = async () => {
  // Get all parent tests (single tests and group tests)
  const [tests] = await db.query(
    'SELECT * FROM lab_test_master WHERE parent_test_id IS NULL ORDER BY test_name'
  );
  
  // For each group test, get its sub-tests
  for (const test of tests) {
    if (test.test_type === 'group') {
      const [subTests] = await db.query(
        'SELECT * FROM lab_test_master WHERE parent_test_id = ? ORDER BY test_name',
        [test.test_id]
      );
      test.subTests = subTests;
    }
  }
  
  return tests;
};

// Update test (single or group) - new function
const updateTestNew = async (id, testData) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const { test_name, unit, ref_value, price, test_type, subTests } = testData;
    
    if (test_type === 'group') {
      // Update group test
      await connection.query(
        'UPDATE lab_test_master SET test_name = ?, price = ? WHERE test_id = ?',
        [test_name, price || 0, id]
      );
      
      // Delete existing sub-tests
      await connection.query('DELETE FROM lab_test_master WHERE parent_test_id = ?', [id]);
      
      // Add new sub-tests
      if (subTests && subTests.length > 0) {
        for (const subTest of subTests) {
          await connection.query(
            'INSERT INTO lab_test_master (test_name, unit, ref_value, test_type, parent_test_id, price) VALUES (?, ?, ?, "single", ?, 0)',
            [subTest.name, subTest.unit || null, subTest.ref_value || null, id]
          );
        }
      }
    } else {
      // Update single test
      await connection.query(
        'UPDATE lab_test_master SET test_name = ?, unit = ?, ref_value = ?, price = ? WHERE test_id = ?',
        [test_name, unit || null, ref_value || null, price || 0, id]
      );
    }
    
    await connection.commit();
    
    // Return updated test
    const [updated] = await connection.query('SELECT * FROM lab_test_master WHERE test_id = ?', [id]);
    
    if (updated.length > 0 && updated[0].test_type === 'group') {
      const [subTestsResult] = await connection.query('SELECT * FROM lab_test_master WHERE parent_test_id = ?', [id]);
      updated[0].subTests = subTestsResult;
    }
    
    return updated.length > 0 ? updated[0] : null;
    
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

module.exports = {
  createTestTable,
  addTest,
  addTestNew,
  addGroupTest,
  addItem,
  getAllTests,
  getAllTestsNew,
  getTestById,
  updateItem,
  updateTest,
  updateTestNew,
  deleteItem,
  deleteTest,
  getAllitems
};