import fetch from 'node-fetch';

async function testCRUD() {
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
    console.log('Creating invoice...');
    const createPayload = {
      patient_id: 1,
      test_id: 1,
      total_amount: 500,
      paid_amount: 0,
      payment_method: 'cash',
      payment_status: 'unpaid',
      patient_name: 'Test Patient',
      test_name: 'Test Test',
      balance_amount: 500,
      invoice_date: new Date().toISOString().split('T')[0]
    };

    const createResponse = await fetch('http://localhost:5000/api/billing/invoices', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(createPayload)
    });

    const createData = await createResponse.json();
    if (!createResponse.ok) throw new Error(`Create failed: ${JSON.stringify(createData)}`);
    const invoiceId = createData.data.invoiceId;
    console.log(`✅ Invoice created with ID: ${invoiceId}`);

    // 3. Update Invoice
    console.log('Updating invoice...');
    const updatePayload = {
      ...createPayload,
      total_amount: 600,
      balance_amount: 600,
      notes: 'Updated via script'
    };

    const updateResponse = await fetch(`http://localhost:5000/api/billing/invoices/${invoiceId}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updatePayload)
    });

    const updateData = await updateResponse.json();
    if (!updateResponse.ok) {
        console.log('Update Error Details:', JSON.stringify(updateData, null, 2));
        throw new Error(`Update failed: ${JSON.stringify(updateData)}`);
    }
    console.log('✅ Invoice updated successfully');

    // 4. Delete Invoice
    console.log('Deleting invoice...');
    const deleteResponse = await fetch(`http://localhost:5000/api/billing/invoices/${invoiceId}`, {
      method: 'DELETE',
      headers: { 
        'Authorization': `Bearer ${token}`
      }
    });

    const deleteData = await deleteResponse.json();
    if (!deleteResponse.ok) throw new Error(`Delete failed: ${JSON.stringify(deleteData)}`);
    console.log('✅ Invoice deleted successfully');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testCRUD();
