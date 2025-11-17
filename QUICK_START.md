# 🚀 QUICK START GUIDE

## Step 1: Database Setup (5 minutes)

```bash
# Connect to MySQL
mysql -u root -p

# Use your database
USE laboratory;

# Run the upgrade schema
source DATABASE_SCHEMA_UPGRADE.sql

# Verify tables created
SHOW TABLES;

# You should see 30+ new tables including:
# - tenants
# - invoices, invoice_items
# - emi_plans, emi_installments
# - party_ledger
# - test_packages
# - inventory_items
# - referring_doctors
# - report_templates
# - and more...

# Create a default tenant
INSERT INTO tenants (
  tenant_name, tenant_code, email, phone, 
  address, city, state, status, subscription_plan_id
) VALUES (
  'Demo Laboratory', 'DL', 'admin@demolab.com', '9876543210',
  '123 Main Street', 'Mumbai', 'Maharashtra', 'active', 2
);

# Verify tenant created
SELECT * FROM tenants;

# Exit MySQL
EXIT;
```

## Step 2: Backend Setup (2 minutes)

```bash
# Navigate to backend
cd backend

# Install any missing dependencies (if needed)
npm install

# Start the upgraded server
node server-upgraded.js

# You should see:
# 🌟 SERVER RUNNING SUCCESSFULLY!
# 🌟 VERSION 2.0.0 - UPGRADED
# 🆕 NEW MODULES AVAILABLE:
#    💰 Billing System
#    💳 EMI Management
#    📊 Party Ledger
#    📦 Test Packages
```

## Step 3: Test the New APIs (5 minutes)

### Test 1: Health Check
```bash
curl http://localhost:5000/api/health
```

Expected: JSON response showing all new modules

### Test 2: Login
```bash
curl -X POST http://localhost:5000/api/auth/login-user \
  -H "Content-Type: application/json" \
  -d '{"email":"test@lab.com","password":"Test@123"}'
```

Expected: `{"token":"eyJhbGc..."}`

Copy the token for next tests!

### Test 3: Create Invoice
```bash
# Replace YOUR_TOKEN with the token from login
curl -X POST http://localhost:5000/api/billing/invoices \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "invoice_date": "2024-11-16",
    "patient_name": "John Doe",
    "patient_contact": "9876543210",
    "patient_email": "john@example.com",
    "subtotal": 1000,
    "tax_amount": 50,
    "total_amount": 1050,
    "balance_amount": 1050,
    "items": [{
      "item_type": "test",
      "item_name": "Blood Test",
      "unit_price": 1000,
      "tax_amount": 50,
      "total_amount": 1050
    }]
  }'
```

Expected: `{"success":true,"message":"Invoice created successfully"}`

### Test 4: Get All Invoices
```bash
curl -X GET http://localhost:5000/api/billing/invoices \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Expected: List of invoices including the one you just created

### Test 5: Create EMI Plan
```bash
curl -X POST http://localhost:5000/api/emi/plans \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "invoice_id": 1,
    "total_amount": 10000,
    "down_payment": 2000,
    "number_of_installments": 8,
    "frequency": "monthly",
    "interest_rate": 0,
    "start_date": "2024-12-01"
  }'
```

Expected: `{"success":true,"message":"EMI plan created successfully"}`

### Test 6: Get EMI Statistics
```bash
curl -X GET http://localhost:5000/api/emi/stats \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Expected: EMI statistics with counts and amounts

### Test 7: Create Package
```bash
curl -X POST http://localhost:5000/api/packages \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "package_name": "Complete Health Checkup",
    "package_code": "CHC001",
    "description": "Comprehensive health screening",
    "category": "Preventive",
    "total_price": 5000,
    "discounted_price": 4000,
    "discount_percent": 20,
    "test_ids": [1, 2]
  }'
```

Expected: `{"success":true,"message":"Package created successfully"}`

## Step 4: Frontend Setup (Optional - 5 minutes)

```bash
# Navigate to frontend
cd laboratory

# Install dependencies (if not already installed)
npm install

# Start frontend
npm start

# Browser should open at http://localhost:3000
# Login with: test@lab.com / Test@123
```

## Step 5: Verify Everything Works

### Backend Checklist:
- [ ] Server starts without errors
- [ ] Health check returns status OK
- [ ] Login works and returns token
- [ ] Can create invoice
- [ ] Can view invoices
- [ ] Can create EMI plan
- [ ] Can create package
- [ ] All endpoints respond correctly

### Database Checklist:
- [ ] All 30+ tables created
- [ ] Default tenant exists
- [ ] Subscription plans inserted
- [ ] Can insert and query data

## Common Issues & Solutions

### Issue 1: Port 5000 already in use
```bash
# Find and kill the process
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or change port in .env
PORT=5001
```

### Issue 2: Database connection error
```bash
# Check .env file
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=laboratory

# Test connection
mysql -u root -p laboratory -e "SELECT 1"
```

### Issue 3: Token invalid
```bash
# Make sure JWT_SECRET matches in .env
JWT_SECRET=Boom#123

# Get a fresh token by logging in again
```

### Issue 4: Tables not found
```bash
# Re-run the schema
mysql -u root -p laboratory < DATABASE_SCHEMA_UPGRADE.sql

# Verify
mysql -u root -p laboratory -e "SHOW TABLES"
```

## Next Steps

Once everything is working:

1. **Review API Documentation**: Check `API_DOCUMENTATION.md` for all endpoints
2. **Follow Implementation Guide**: See `IMPLEMENTATION_GUIDE.md` for building remaining features
3. **Build Frontend Components**: Use templates in `IMPLEMENTATION_GUIDE.md`
4. **Add More Modules**: Inventory, Doctors, Templates, etc.

## Testing with Postman

1. Import this collection:
   - Create new collection "LMS API"
   - Add environment variable `token`
   - Add environment variable `baseUrl` = `http://localhost:5000`

2. Create requests:
   - POST {{baseUrl}}/api/auth/login-user
   - GET {{baseUrl}}/api/billing/invoices
   - POST {{baseUrl}}/api/billing/invoices
   - GET {{baseUrl}}/api/emi/plans
   - POST {{baseUrl}}/api/emi/plans

3. Set Authorization:
   - Type: Bearer Token
   - Token: {{token}}

## Success Criteria

You're ready to continue when:
- ✅ Server starts successfully
- ✅ Can login and get token
- ✅ Can create and view invoices
- ✅ Can create and view EMI plans
- ✅ Can create and view packages
- ✅ All API tests pass

## Need Help?

1. Check server logs for errors
2. Review `API_DOCUMENTATION.md`
3. Check `IMPLEMENTATION_GUIDE.md`
4. Verify database schema is correct
5. Ensure all dependencies are installed

---

**You're now ready to build the complete system! Follow the IMPLEMENTATION_GUIDE.md for next steps.**
