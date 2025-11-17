# 🔧 FIX ALL PAGES - AUTHENTICATION GUIDE

## ✅ Pages Fixed So Far:
1. ✅ Dashboard.js
2. ✅ TestListPage.js  
3. ✅ PatientListPage.js

## ❌ Pages Still Need Fixing:

### 4. PatientEntryPage.js
- Line 62: `axios.get(${process.env.REACT_APP_API_URL}/api/tests/all-items)`
- **Fix:** Change to `api.get('/tests/all-items')`

### 5. ReportEntryPage.js
- Line 100: `axios.post(${process.env.REACT_APP_API_URL}/api/reports/tests/fetch)`
- Line 123: `axios.get(${process.env.REACT_APP_API_URL}/api/tests/all-tests)`
- **Fix:** Change to `api.post('/reports/tests/fetch')` and `api.get('/tests/all-tests')`

### 6. NewTestCreationPage.js
- Line 37: `axios.post(${process.env.REACT_APP_API_URL}/api/tests/create-test)`
- **Fix:** Change to `api.post('/tests/create-test')`

### 7. NewItemCreationPage.js
- Line 24: `axios.get(${process.env.REACT_APP_API_URL}/api/tests/all-tests)`
- Line 55: `axios.post(${process.env.REACT_APP_API_URL}/api/tests/create-item)`
- **Fix:** Change to `api.get('/tests/all-tests')` and `api.post('/tests/create-item')`

### 8. ItemListPage.js
- Line 25: `axios.get(${process.env.REACT_APP_API_URL}/api/tests/all-tests)`
- Line 57: `axios.get(${process.env.REACT_APP_API_URL}/api/tests//all-items)`
- Line 80: `axios.delete(${process.env.REACT_APP_API_URL}/api/tests/item/${itemId})`
- Line 115: `axios.put(${process.env.REACT_APP_API_URL}/api/tests/item/${selectedItem.item_id})`
- **Fix:** Change all to use `api` instance

## 🔧 Quick Fix Steps for Each Page:

### Step 1: Change Import
```javascript
// Find this line:
import axios from 'axios';

// Replace with:
import api from '../utils/api';
```

### Step 2: Replace All API Calls
```javascript
// Find patterns like:
axios.get(`${process.env.REACT_APP_API_URL}/api/endpoint`)
axios.post(`${process.env.REACT_APP_API_URL}/api/endpoint`, data)
axios.put(`${process.env.REACT_APP_API_URL}/api/endpoint`, data)
axios.delete(`${process.env.REACT_APP_API_URL}/api/endpoint`)

// Replace with:
api.get('/endpoint')
api.post('/endpoint', data)
api.put('/endpoint', data)
api.delete('/endpoint')
```

### Step 3: Update fetch() calls (if any)
```javascript
// Find:
fetch(`${process.env.REACT_APP_API_URL}/api/endpoint`)
  .then(res => res.json())
  .then(data => { ... })

// Replace with:
api.get('/endpoint')
  .then(res => {
    const data = res.data;
    // ... rest of code
  })
```

## 🎯 Why This Fix is Needed:

The `api` instance from `../utils/api.js` automatically:
- ✅ Adds `Authorization: Bearer <token>` header to all requests
- ✅ Handles token expiration
- ✅ Redirects to login on 401 errors
- ✅ Uses correct base URL

Without using the `api` instance:
- ❌ No authentication headers sent
- ❌ Backend returns 401 Unauthorized
- ❌ Pages show "Request failed with status code 401"

## 🚀 After Fixing All Pages:

All pages will work properly with authentication:
- ✅ Dashboard - Working
- ✅ Test Lists - Working
- ✅ Patient Lists - Working
- ✅ Patient Entry - Working
- ✅ Report Entry - Working
- ✅ All CRUD operations - Working

## 📝 Testing After Fix:

1. Start backend: `cd backend && npm start`
2. Start frontend: `cd laboratory && npm start`
3. Login with: `test@lab.com` / `Test@123`
4. Test each page:
   - Dashboard ✅
   - Test Lists ✅
   - Patient Lists ✅
   - Patient Entry ✅
   - Report Entry ✅
   - All other pages ✅

No more 401 errors!