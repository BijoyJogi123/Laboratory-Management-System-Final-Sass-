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
exports.createTest = async (req, res) => {
  const { test_name, unit, ref_value } = req.body;

  // Validate the request body
  if (!test_name || !unit || !ref_value) {
    return res.status(400).json({ message: 'test_name, unit, and ref_value are required' });
  }

  console.log('✅ Creating test:', { test_name, unit, ref_value });

  try {
    const result = await Test.addTest(test_name, unit, ref_value);
    console.log('✅ Test added successfully, ID:', result.insertId);
    res.status(201).json({ message: 'Test added successfully', testId: result.insertId });
  } catch (err) {
    console.error('❌ Error adding test:', err);
    res.status(500).json({ message: 'Error adding test', error: err.message });
  }
};

// Add single test (new endpoint)
exports.addTest = async (req, res) => {
  try {
    console.log('➕ Adding new single test:', req.body);
    const { test_name, unit, ref_value, price } = req.body;
    
    const newTest = await Test.addTestNew({
      test_name,
      unit,
      ref_value,
      price
    });
    
    console.log('✅ Single test created in database:', test_name);
    res.json({
      success: true,
      data: newTest,
      message: 'Test created successfully'
    });
  } catch (error) {
    console.error('❌ Error creating test:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error creating test', 
      error: error.message 
    });
  }
};

// Add group test with sub-tests (new endpoint)
exports.addGroupTest = async (req, res) => {
  try {
    console.log('➕ Adding new group test:', req.body);
    const { test_name, price, subTests } = req.body;
    
    if (!subTests || subTests.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Group test must have at least one sub-test'
      });
    }
    
    const newGroupTest = await Test.addGroupTest({
      test_name,
      price,
      subTests
    });
    
    console.log(`✅ Group test created with ${subTests.length} sub-tests:`, test_name);
    res.json({
      success: true,
      data: newGroupTest,
      message: `Group test created with ${subTests.length} sub-tests`
    });
  } catch (error) {
    console.error('❌ Error creating group test:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error creating group test', 
      error: error.message 
    });
  }
};

// Get all tests
exports.getAllTests = async (req, res) => {
  try {
    const tests = await Test.getAllTestsNew();
    res.status(200).json(tests);
  } catch (err) {
    console.error('❌ Error fetching tests:', err);
    res.status(500).json({ message: 'Error fetching tests', error: err.message });
  }
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



exports.updateTest = async (req, res) => {
  const { id } = req.params;
  const { test_name, unit, ref_value, price, test_type, subTests } = req.body;

  if (!test_name) {
    return res.status(400).json({ message: 'Test name is required' });
  }

  try {
    console.log(`🔄 Updating ${test_type || 'single'} test:`, test_name);
    
    const updated = await Test.updateTestNew(id, {
      test_name,
      unit,
      ref_value,
      price,
      test_type,
      subTests
    });
    
    if (!updated) {
      return res.status(404).json({ 
        success: false,
        message: 'Test not found' 
      });
    }
    
    console.log('✅ Test updated in database:', test_name);
    res.json({
      success: true,
      data: updated,
      message: 'Test updated successfully'
    });
  } catch (err) {
    console.error('❌ Error updating test:', err);
    res.status(500).json({ 
      success: false,
      message: 'Error updating test', 
      error: err.message 
    });
  }
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
exports.deleteTest = async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await Test.deleteTest(id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Test not found' });
    }
    console.log('✅ Test deleted successfully, ID:', id);
    res.status(200).json({ message: 'Test deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting test:', err);
    res.status(500).json({ message: 'Error deleting test', error: err.message });
  }
};