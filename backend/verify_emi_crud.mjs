import fetch from 'node-fetch';

async function verifyEMICRUD() {
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
    console.log('Creating invoice for EMI CRUD...');
    const createInvoicePayload = {
      patient_id: 1,
      test_id: 1,
      total_amount: 15000,
      paid_amount: 0,
      payment_method: 'cash',
      payment_status: 'unpaid',
      patient_name: 'EMI CRUD Patient',
      test_name: 'Full Body Checkup',
      balance_amount: 15000,
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
      total_amount: 15000,
      down_payment: 3000,
      interest_rate: 10,
      number_of_installments: 6,
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
        console.log('EMI Creation Error:', JSON.stringify(emiData, null, 2));
        throw new Error(`EMI Plan creation failed`);
    }
    const emiPlanId = emiData.data.emiPlanId;
    console.log(`✅ EMI Plan created with ID: ${emiPlanId}`);

    // 4. Update EMI Plan
    console.log('Updating EMI Plan...');
    const updatePayload = {
      status: 'completed',
      notes: 'Updated via script'
    };

    const updateResponse = await fetch(`http://localhost:5000/api/emi/plans/${emiPlanId}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updatePayload)
    });

    const updateData = await updateResponse.json();
    if (!updateResponse.ok) {
        console.log('EMI Update Error Details:', JSON.stringify(updateData, null, 2));
        throw new Error(`EMI Plan update failed: ${JSON.stringify(updateData)}`);
    }
    console.log('✅ EMI Plan updated successfully');

    // 5. Delete EMI Plan
    console.log('Deleting EMI Plan...');
    const deleteResponse = await fetch(`http://localhost:5000/api/emi/plans/${emiPlanId}`, {
      method: 'DELETE',
      headers: { 
        'Authorization': `Bearer ${token}`
      }
    });

    const deleteData = await deleteResponse.json();
    if (!deleteResponse.ok) {
        console.log('EMI Delete Error:', JSON.stringify(deleteData, null, 2));
        throw new Error(`EMI Plan delete failed`);
    }
    console.log('✅ EMI Plan deleted successfully');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

verifyEMICRUD();
