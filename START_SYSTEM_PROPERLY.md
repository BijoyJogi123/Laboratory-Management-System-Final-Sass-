# Laboratory Management System - Quick Start Guide

## Current Status

✅ Backend server is running
✅ Database connection is working  
✅ Login authentication is working (test@lab.com / Test@123)
❌ Patients table is missing

## Fix the Database (REQUIRED)

### Step 1: Create Missing Tables

**Double-click this file:**
```
FIX-DATABASE.bat
```

OR run this command:
```bash
mysql -h 127.0.0.1 -u root -pCyberdumb#123 laboratory < SETUP_DATABASE_NOW.sql
```

### Step 2: Restart Backend

```bash
cd backend
npm start
```

### Step 3: Start Frontend

```bash
cd laboratory
npm start
```

## Login Credentials

- **Email:** test@lab.com
- **Password:** Test@123

## What's Working Now

1. ✅ Database connection (.env properly loaded)
2. ✅ User authentication
3. ✅ JWT token generation
4. ✅ Protected routes with middleware

## What Will Work After Database Fix

1. ✅ Create patients
2. ✅ View patient list
3. ✅ Manage tests
4. ✅ Manage items/inventory
5. ✅ Billing and invoices
6. ✅ EMI management

## Backend API Endpoints

All these are already implemented in your backend:

- `POST /api/auth/login` - Login
- `GET /api/patients` - Get all patients
- `POST /api/patients` - Create patient
- `GET /api/patients/:id` - Get patient by ID
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient
- `GET /api/emi` - Get all EMI plans
- `POST /api/emi` - Create EMI plan

## Troubleshooting

### If backend shows "Table doesn't exist"
Run: `FIX-DATABASE.bat`

### If login fails
Check that test user exists in database:
```sql
SELECT * FROM users WHERE email = 'test@lab.com';
```

### If .env not loading
Make sure `backend/.env` contains:
```
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=Cyberdumb#123
DB_NAME=laboratory
JWT_SECRET=Boom#123
```

## Next Steps

After fixing the database:

1. Test patient creation
2. Test all CRUD operations
3. Connect frontend pages to backend APIs
4. Test billing and EMI features
