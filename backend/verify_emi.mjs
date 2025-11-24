import fetch from 'node-fetch';

async function verifyEMI() {
  try {
    // 1. Login
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
    console.log('✅ Login successful');

    // 2. Create Invoice
    console.log('Creating invoice for EMI...');
    const createInvoicePayload = {
      patient_id: 1, // Assuming patient 1 exists
      test_id: 1,
      total_amount: 12000,
      paid_amount: 0,
      payment_method: 'cash',
      payment_status: 'unpaid',
      patient_name: 'EMI Test Patient',
      test_name: 'Full Body Checkup',
      balance_amount: 12000,
      invoice_date: new Date().toISOString().split('T')[0]
    };

    const invoiceResponse = await fetch('http://localhost:5000/api/billing/invoices', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(createInvoicePayload)
    });

    const invoiceData = await invoiceResponse.json();
    if (!invoiceResponse.ok) throw new Error(`Invoice creation failed: ${JSON.stringify(invoiceData)}`);
    const invoiceId = invoiceData.data.invoiceId;
    console.log(`✅ Invoice created with ID: ${invoiceId}`);

    // 3. Create EMI Plan
    console.log('Creating EMI Plan...');
    const emiPayload = {
      invoice_id: invoiceId,
      total_amount: 12000,
      down_payment: 2000,
      interest_rate: 10,
      number_of_installments: 5,
      start_date: new Date().toISOString().split('T')[0],
      frequency: 'monthly'
    };

    const emiResponse = await fetch('http://localhost:5000/api/emi/plans', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(emiPayload)
    });

    const emiData = await emiResponse.json();
    if (!emiResponse.ok) {
        console.log('EMI Creation Error Details:', JSON.stringify(emiData, null, 2));
        throw new Error(`EMI Plan creation failed: ${JSON.stringify(emiData)}`);
    }
    console.log('✅ EMI Plan created successfully:', emiData);

    // 4. Fetch EMI Plans
    console.log('Fetching EMI Plans...');
    const plansResponse = await fetch('http://localhost:5000/api/emi/plans', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const plansData = await plansResponse.json();
    console.log(`✅ Fetched ${plansData.data.length} EMI plans`);

    // 5. Fetch Due Installments
    console.log('Fetching Due Installments...');
    const dueResponse = await fetch('http://localhost:5000/api/emi/installments/due', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const dueData = await dueResponse.json();
    console.log(`✅ Fetched ${dueData.data.length} due installments`);

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

verifyEMI();
