# Fix Tests Feature - Complete Guide

## What Was Wrong

1. ❌ Test routes not registered in server.js
2. ❌ Backend expecting different fields than frontend sending
3. ❌ Tests table might not exist or have wrong structure

## What I Fixed

### 1. Added Test Routes to Server
- ✅ Registered `/api/tests` routes in server.js
- ✅ Added both `/api/tests` and `/api/tests/create-test` endpoints

### 2. Updated Backend to Match Frontend
- ✅ Controller now accepts: test_name, test_code, category, price, tat_hours, sample_type, description
- ✅ Model updated to insert into correct `tests` table
- ✅ GET endpoint returns from `tests` table

### 3. Database Table Structure
The `tests` table now has these fields:
- id (auto increment)
- test_name
- test_code
- category
- price
- tat_hours
- sample_type
- description
- is_active
- created_at
- updated_at

## How to Fix Right Now

### Step 1: Create/Update Tests Table

Run this command:
```bash
node create-tests-table.js
```

OR run the SQL directly:
```bash
mysql -h 127.0.0.1 -u root -pCyberdumb#123 laboratory < SETUP_DATABASE_NOW.sql
```

### Step 2: Restart Backend

Stop the backend (Ctrl+C) and restart:
```bash
cd backend
npm start
```

### Step 3: Test It

1. Login to frontend: http://localhost:3000
2. Go to Tests page
3. Click "Add Test"
4. Fill in the form
5. Submit

It should work now!

## API Endpoints Available

- `GET /api/tests/all-tests` - Get all tests
- `POST /api/tests` - Create new test
- `POST /api/tests/create-test` - Create new test (alternative)
- `GET /api/tests/test/:id` - Get test by ID
- `PUT /api/tests/test/:id` - Update test
- `DELETE /api/tests/test/:id` - Delete test

## Test the Backend Directly

You can test with curl:

```bash
# Get all tests
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5000/api/tests/all-tests

# Create a test
curl -X POST http://localhost:5000/api/tests \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "test_name": "Complete Blood Count",
    "test_code": "CBC001",
    "category": "hematology",
    "price": 500,
    "tat_hours": 24,
    "sample_type": "Blood",
    "description": "Complete blood count test"
  }'
```

## Troubleshooting

### If you get "Table doesn't exist"
Run: `node create-tests-table.js`

### If you get "Route not found"
Make sure backend is restarted after the changes

### If you get "Unauthorized"
Make sure you're logged in and token is valid

### If tests don't show up
Check browser console for errors and backend logs
