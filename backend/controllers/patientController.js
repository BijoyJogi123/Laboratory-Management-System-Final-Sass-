const Patient = require('../models/patientModel');

// Create a new patient
exports.createPatient = (req, res) => {
  const { patientData, testIds } = req.body;

  console.log( patientData, testIds ,"yaaaaa commingggg")

  // Validate the patient data (remove sales_id from validation)
  if (!patientData || !patientData.patient_name) {
    return res.status(400).json({ message: 'Patient name is required' });
  }

  // Add the patient and their tests to the database
  Patient.addPatient(patientData, testIds, (err, result) => {

    // console.log(patientData,"this is patient", testIds);


    if (err){

      console.log(err)
      return res.status(500).json({ message: 'Error adding patient',err });
    } 

    res.status(201).json({
      message: 'Patient added successfully',
      patientId: result.insertId  // This is the auto-generated sales_id
    });
  });
};

// Get all patients
exports.getAllPatients = (req, res) => {
  Patient.getAllPatients((err, patients) => {
    if (err) return res.status(500).json({ message: 'Error fetching patients' });
    res.status(200).json(patients);
  });
};

//Get all patient-tests
exports.getAllPatientsTests = (req, res) => {
  Patient.getAllPatientsTests((err, patientsTests) => {
    if (err) return res.status(500).json({ message: 'Error fetching patients-test' });
    res.status(200).json(patientsTests);
  });
};

// Get patient-tests by ID
exports.getPatientTestById = (req, res) => {
  const { id } = req.params;
  Patient.getPatientTestById(id, (err, patient) => {
    if (err) return res.status(500).json({ message: 'Error fetching patient' ,err});
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.status(200).json(patient);
  });
};


// Get patient-tests by ID
exports.getPatientById = (req, res) => {
  const { id } = req.params;
  Patient.getPatientById(id, (err, patient) => {
    if (err) return res.status(500).json({ message: 'Error fetching patient' ,err});
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.status(200).json(patient);
  });
};

// Update patient
exports.updatePatient = (req, res) => {
  const { id } = req.params;
  const updatedPatientData = req.body;

  Patient.updatePatient(id, updatedPatientData, (err, result) => {
    if (err) {console.log(err); return res.status(500).json({ message: 'Error updating patient',err });  }
    res.status(200).json({ message: 'Patient updated successfully', result });
  });
};



// // Update any provided fields for lab_sales_item
// exports.updateLabSalesItem = (req, res) => {
//   const { id } = req.params;  // Extract lab_sales_item id from URL
//   const updateData = req.body;  // Extract fields to be updated from the request body

//   // Check if there is any data to update
//   if (!Object.keys(updateData).length) {
//     return res.status(400).json({ message: 'No data provided to update' });
//   }

//   // Call the model to update
//   Patient.updateLabSalesItem(id, updateData, (err, result) => {
//     if (err) {
//       console.log(err,"boom")
//       return res.status(500).json({ error: 'Database update failed', details: err });
//     }
//     if (result.affectedRows === 0) {
//       return res.status(404).json({ error: 'LabSalesItem not found' });
//     }
//     res.status(200).json({ message: 'LabSalesItem updated successfully' });
//   });
// };

// Update any provided fields for lab_sales_item
exports.updateLabSalesItem = (req, res) => {
  const { id } = req.params;  // Extract lab_sales_item id from URL
  const updateData = req.body;  // Extract fields to be updated from the request body

  // Check if there is any data to update
  if (!Object.keys(updateData).length) {
    return res.status(400).json({ message: 'No data provided to update' });
  }

  // If doctor_sign exists in updateData, convert it to Buffer
  if (updateData.doctor_sign) {
    const doctorSignBuffer = Buffer.from(updateData.doctor_sign.split(',')[1], 'base64'); // Extract the Base64 string
    updateData.doctor_sign = doctorSignBuffer; // Store the Buffer in updateData
  }

  // Call the model to update
  Patient.updateLabSalesItem(id, updateData, (err, result) => {
    if (err) {
      console.log(err, "boom");
      return res.status(500).json({ error: 'Database update failed', details: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'LabSalesItem not found' });
    }
    res.status(200).json({ message: 'LabSalesItem updated successfully' });
  });
};





// Delete patient
exports.deletePatient = (req, res) => {
  const { id } = req.params;

  Patient.deletePatient(id, (err, result) => {
    if (err) return res.status(500).json({ message: 'Error deleting patient',err });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Patient not found' });
    res.status(200).json({ message: 'Patient deleted successfully' });
  });
};
