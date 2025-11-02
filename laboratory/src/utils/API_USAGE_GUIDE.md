# API Usage Guide

This guide shows you how to use the new authenticated API instance for making requests to the backend.

## Overview

The API instance (`api`) is configured with:
- Automatic Authorization header injection (Bearer token)
- Token expiration handling
- Automatic redirects on 401 errors
- Base URL proxy configuration

## Import the API Instance

```javascript
import api from '../utils/api';
```

## Examples

### GET Request

```javascript
// Fetch all patients
const fetchPatients = async () => {
  try {
    const response = await api.get('/patients/all-patients');
    console.log(response.data);
  } catch (error) {
    console.error('Error fetching patients:', error);
  }
};
```

### POST Request

```javascript
// Create a new test
const createTest = async (testData) => {
  try {
    const response = await api.post('/tests/create-test', testData);
    console.log('Test created:', response.data);
  } catch (error) {
    console.error('Error creating test:', error);
  }
};
```

### PUT Request

```javascript
// Update a patient
const updatePatient = async (patientId, updatedData) => {
  try {
    const response = await api.put(`/patients/patient/${patientId}`, updatedData);
    console.log('Patient updated:', response.data);
  } catch (error) {
    console.error('Error updating patient:', error);
  }
};
```

### DELETE Request

```javascript
// Delete a test
const deleteTest = async (testId) => {
  try {
    const response = await api.delete(`/tests/test/${testId}`);
    console.log('Test deleted:', response.data);
  } catch (error) {
    console.error('Error deleting test:', error);
  }
};
```

## Important Notes

1. **Do NOT use axios or fetch directly** - Always use the `api` instance from `utils/api.js`
2. **No need to add Authorization headers manually** - The interceptor handles this automatically
3. **Token expiration is handled automatically** - Users will be redirected to login if token expires
4. **Use relative URLs** - Start with `/tests`, `/patients`, `/reports`, etc. (not the full URL)
5. **Login endpoint is an exception** - Login is handled by AuthContext, not the api instance

## Real-World Component Example

```javascript
import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await api.get('/patients/all-patients');
      setPatients(response.data);
    } catch (error) {
      toast.error('Failed to fetch patients');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (patientId) => {
    try {
      await api.delete(`/patients/patient/${patientId}`);
      toast.success('Patient deleted successfully');
      // Refresh the list
      fetchPatients();
    } catch (error) {
      toast.error('Failed to delete patient');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {patients.map(patient => (
        <div key={patient.id}>
          <h3>{patient.name}</h3>
          <button onClick={() => handleDelete(patient.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default PatientList;
```

## Migration Checklist

To update existing components to use the new API system:

1. Replace `axios` or `fetch` imports with `import api from '../utils/api'`
2. Change `axios.get/post/put/delete` to `api.get/post/put/delete`
3. Update URLs to use relative paths (remove `http://localhost:5000`)
4. Remove manual Authorization headers
5. Test the component thoroughly

## Available Endpoints

### Auth Routes
- POST `/api/auth/login-user` - Login (handled by AuthContext)
- GET `/api/auth/generate-captcha` - Get CAPTCHA
- POST `/api/auth/verify-captcha` - Verify CAPTCHA

### User Routes (Protected)
- POST `/api/user/users` - Create user (public)
- GET `/api/user/users` - Get all users (protected)

### Test Routes (Protected)
- POST `/api/tests/create-test` - Create test
- POST `/api/tests/create-item` - Create item
- GET `/api/tests/all-tests` - Get all tests
- GET `/api/tests/all-items` - Get all items
- GET `/api/tests/test/:id` - Get test by ID
- PUT `/api/tests/test/:id` - Update test
- PUT `/api/tests/item/:id` - Update item
- DELETE `/api/tests/test/:id` - Delete test
- DELETE `/api/tests/item/:id` - Delete item

### Patient Routes (Protected)
- POST `/api/patients/add-patients` - Create patient
- GET `/api/patients/all-patients` - Get all patients
- GET `/api/patients/all-patients-tests` - Get all patient tests
- GET `/api/patients/patient/:id` - Get patient tests by ID
- GET `/api/patients/specific-patient/:id` - Get patient by ID
- PUT `/api/patients/patient/:id` - Update patient
- PUT `/api/patients/patient/sales/:id` - Update lab sales
- DELETE `/api/patients/patient/:id` - Delete patient

### Report Routes (Protected)
- POST `/api/reports/submit` - Submit report
- GET `/api/reports/report/:sales_item_id` - Get report
- POST `/api/reports/tests/fetch` - Fetch tests by IDs
