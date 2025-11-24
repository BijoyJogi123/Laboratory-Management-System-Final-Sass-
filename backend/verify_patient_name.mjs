import fetch from 'node-fetch';

async function verifyPatientName() {
  try {
    // Login
    console.log('Logging in...');
    const loginResponse = await fetch('http://localhost:5000/api/auth/login-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@lab.com',
        password: 'Test@123'
      })
    });

    const loginData = await loginResponse.json();
    if (!loginResponse.ok) throw new Error(`Login failed: ${JSON.stringify(loginData)}`);
    const token = loginData.token;

    // Fetch Invoices
    console.log('Fetching invoices...');
    const response = await fetch('http://localhost:5000/api/billing/invoices', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const data = await response.json();
    const invoices = data.data || data;

    console.log(`Found ${invoices.length} invoices`);
    invoices.forEach(inv => {
      console.log(`Invoice: ${inv.invoice_number}, Patient: ${inv.patient_name} (ID: ${inv.patient_id})`);
    });

  } catch (error) {
    console.error('Error:', error);
  }
}

verifyPatientName();
