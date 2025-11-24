import fetch from 'node-fetch';

async function checkPatient() {
  try {
    // Login
    const loginResponse = await fetch('http://localhost:5000/api/auth/login-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@lab.com',
        password: 'Test@123'
      })
    });
    const loginData = await loginResponse.json();
    const token = loginData.token;

    // Check Patient 3
    console.log('Checking patient 3...');
    const response = await fetch('http://localhost:5000/api/patients/all-patients', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const patients = await response.json();
    const patient = patients.find(p => p.patient_id === 3);
    
    if (patient) {
      console.log('Found patient:', patient);
    } else {
      console.log('Patient 3 NOT found');
      if (patients.length > 0) {
        console.log('First patient object keys:', Object.keys(patients[0]));
        console.log('First patient object:', patients[0]);
      }
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

checkPatient();
