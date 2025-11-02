const Test = require('../models/testModel');




// Create a new item
exports.createItem = (req, res) => {
  const {department, item_name, price, tax_slab, unit, ref_value, related_test } = req.body;



  // Validate the request body
  if (!department || !item_name || !price || !tax_slab || !unit || !ref_value || !related_test) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  console.log({department, item_name, price, tax_slab, unit, ref_value, related_test }, "byyeyeyye")
  // Add the test to the database
  Test.addItem(department, item_name, price, tax_slab, unit, ref_value, related_test, (err, result) => {
    if (err) return res.status(500).json({ message: 'Error adding Item', err });
    res.status(201).json({ message: 'Item added successfully', testId: result.insertId });
  });
};




// Create a new test
exports.createTest = (req, res) => {
  // const { item_name, price, tax_slab, unit, ref_value } = req.body;

  const { test_name, unit, ref_value } = req.body;

  // Validate the request body
  // if (!item_name || !price || !tax_slab || !unit || !ref_value) {
  //   return res.status(400).json({ message: 'All fields are required' });
  // }
  if (!test_name || !unit || !ref_value) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Add the test to the database
  //   Test.addTest(item_name, price, tax_slab, unit, ref_value, (err, result) => {
  //     if (err) return res.status(500).json({ message: 'Error adding test' });
  //     res.status(201).json({ message: 'Test added successfully', testId: result.insertId });
  //   });
  // };

  Test.addTest(test_name, unit, ref_value, (err, result) => {
    if (err) return res.status(500).json({ message: 'Error adding test', err });
    res.status(201).json({ message: 'Test added successfully', testId: result.insertId });
  });
};

// Get all tests
exports.getAllTests = (req, res) => {
  Test.getAllTests((err, tests) => {
    if (err) return res.status(500).json({ message: 'Error fetching tests' });
    res.status(200).json(tests);
  });
};



// Get all Items
exports.getAllItems = (req, res) => {
  Test.getAllitems((err, tests) => {
    if (err) return res.status(500).json({ message: 'Error fetching Items' });
    res.status(200).json(tests);
  });
};

// Get a test by ID
exports.getTestById = (req, res) => {
  const { id } = req.params;
  Test.getTestById(id, (err, test) => {
    if (err) return res.status(500).json({ message: 'Error fetching test' });
    if (!test) return res.status(404).json({ message: 'Test not found' });
    res.status(200).json(test);
  });
};

// Update a test by ID
// exports.updateTest = (req, res) => {
//   const { id } = req.params;
//   const { item_name, price, tax_slab, unit, ref_value } = req.body;

//   if (!item_name || !price || !tax_slab || !unit || !ref_value) {
//     return res.status(400).json({ message: 'All fields are required' });
//   }

//   Test.updateTest(id, item_name, price, tax_slab, unit, ref_value, (err, result) => {
//     if (err) return res.status(500).json({ message: 'Error updating test' });
//     if (result.affectedRows === 0) return res.status(404).json({ message: 'Test not found' });
//     res.status(200).json({ message: 'Test updated successfully' });
//   });
// };

exports.updateItem = (req, res) => {
  const { id } = req.params;

  const {item_name, price,tax_slab, unit, ref_value,related_test } = req.body;

  // if (!test_name || !unit || !ref_value) {
  //   return res.status(400).json({ message: 'All fields are required' });
  // }

  Test.updateItem(id, item_name,price,tax_slab, unit, ref_value,related_test, (err, result) => {
    if (err) return res.status(500).json({ message: 'Error updating Item', err });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Item not found' });
    res.status(200).json({ message: 'Item updated successfully' });
  });
};



exports.updateTest = (req, res) => {
  const { id } = req.params;

  const { test_name, unit, ref_value } = req.body;

  if (!test_name || !unit || !ref_value) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  Test.updateTest(id, test_name, unit, ref_value, (err, result) => {
    if (err) return res.status(500).json({ message: 'Error updating test', err });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Test not found' });
    res.status(200).json({ message: 'Test updated successfully' });
  });
};



// Delete a Item by ID
exports.deleteItem = (req, res) => {
  const { id } = req.params;
  Test.deleteItem(id, (err, result) => {
    if (err) return res.status(500).json({ message: 'Error deleting Item' });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Item not found' },err);
    res.status(200).json({ message: 'Item deleted successfully' });
  });
};


// Delete a test by ID
exports.deleteTest = (req, res) => {
  const { id } = req.params;
  Test.deleteTest(id, (err, result) => {
    if (err) return res.status(500).json({ message: 'Error deleting test' });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Test not found' });
    res.status(200).json({ message: 'Test deleted successfully' });
  });
};