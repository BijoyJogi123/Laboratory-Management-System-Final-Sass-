const reportModel = require('../models/reportModel');

// Controller to handle report submission
exports.submitReport = (req, res) => {
  const { sales_item_id, testReports } = req.body;

  // Validate input
  if (!sales_item_id || !testReports || testReports.length === 0) {
    return res.status(400).json({ message: 'Sales item ID and test reports are required' });
  }

  // Pass the report data to the model for insertion
  reportModel.submitReport(req.body, (err, result) => {
    if (err) {
      console.log(err)
      return res.status(500).json({ message: 'Error submitting report',  err });
    }
    res.status(201).json(result);
  });
};

// Controller to fetch report data by sales_item_id
exports.getReportBySalesItemId = (req, res) => {
  const { sales_item_id } = req.params;

  // Validate sales_item_id
  if (!sales_item_id) {
    return res.status(400).json({ message: 'Sales item ID is required' });
  }

  // Call the model to retrieve the report
  reportModel.getReportBySalesItemId(sales_item_id, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching report', error: err });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: 'No report found for the given sales item ID' });
    }
    res.status(200).json(result);
  });
};


//This is for getting Specific  Tests from lab_test_master




// Controller to handle fetching tests by IDs
exports.fetchTestsByIds = (req, res) => {
  const { testIds } = req.body; // Expecting an array of test IDs in the request body

  // Validate testIds
  if (!Array.isArray(testIds) || testIds.length === 0) {
    return res.status(400).json({ error: 'Invalid test IDs' });
  }

  // Call the model function to get tests
  reportModel.getTestsByIds(testIds, (err, tests) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching tests' });
    }
    res.json(tests); // Return the fetched tests
  });
};
