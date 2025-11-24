import fetch from 'node-fetch';

async function testCreateInvoice() {
  try {
    // Login to get token
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
    if (!loginResponse.ok) {
      throw new Error(`Login failed: ${JSON.stringify(loginData)}`);
    }

    const token = loginData.token;
    console.log('Got token:', token);

    // Payload similar to what frontend sends
    const payload = {
      patient_id: 1,
      test_id: 1,
      total_amount: 500,
      paid_amount: 0,
      payment_method: 'cash',
      payment_status: 'unpaid',
      patient_name: 'Test Patient',
      test_name: 'Test Test',
      balance_amount: 500,
      invoice_date: new Date().toISOString()
    };

    console.log('Sending payload:', payload);

    const response = await fetch('http://localhost:5000/api/billing/invoices', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    console.log('Response status:', response.status);
    if (data.error) {
        console.log('Error Message:', data.error);
    }
    if (data.details) {
        console.log('Error Details:', data.details);
    }
    console.log('Full Response:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }
}

testCreateInvoice();
