# 🚀 GETTING STARTED - 3 Simple Steps

## ⚡ FASTEST START (Works Immediately!)

### Option A: No-DB Mode (Recommended - 0 setup!)
```bash
cd backend
node server-v2-no-db.js
```

✅ **Works right now!** No database setup needed.
- Your existing features work perfectly
- Login, patients, tests all functional
- New features show setup instructions

### Option B: Full Setup (15 minutes - All features)

**If you get database password error, see:** `FIX_DATABASE_CONNECTION.md`

```bash
# 1. Fix MySQL password in backend/.env
# 2. Install database
mysql -u root -p laboratory < DATABASE_SCHEMA_UPGRADE.sql

# 3. Start full server
cd backend
node server-upgraded.js
```

### Option C: Automated Setup
```bash
setup-complete-system.bat
```

---

## 🧪 Test Your System (2 Minutes)

### Option 1: Automated Tests
```bash
node test-new-features.js
```

### Option 2: Manual Test
```bash
# 1. Check health
curl http://localhost:5000/api/health

# 2. Login
curl -X POST http://localhost:5000/api/auth/login-user ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test@lab.com\",\"password\":\"Test@123\"}"

# Copy the token from response, then:

# 3. Create invoice
curl -X POST http://localhost:5000/api/billing/invoices ^
  -H "Authorization: Bearer YOUR_TOKEN" ^
  -H "Content-Type: application/json" ^
  -d "{\"invoice_date\":\"2024-11-16\",\"patient_name\":\"John Doe\",\"total_amount\":1000,\"balance_amount\":1000,\"items\":[{\"item_name\":\"Blood Test\",\"unit_price\":1000,\"total_amount\":1000}]}"
```

---

## 📚 What to Read Next

### If Everything Works:
1. **API_DOCUMENTATION.md** - Learn all API endpoints
2. **IMPLEMENTATION_GUIDE.md** - Build remaining features

### If You Have Issues:
1. **QUICK_START.md** - Detailed troubleshooting
2. Check server logs for errors

---

## 🎯 What You Can Do Now

### ✅ Working Features:
- Create invoices with custom numbering
- Record payments
- Create EMI plans with auto-installments
- Track party ledger with running balance
- Create test packages with discounts

### 📝 Try These:

**Create an Invoice:**
- POST /api/billing/invoices
- See it in: GET /api/billing/invoices

**Set Up EMI:**
- POST /api/emi/plans
- See installments: GET /api/emi/plans/:id

**View Ledger:**
- GET /api/ledger/party/:partyId
- See summary: GET /api/ledger/summary

**Create Package:**
- POST /api/packages
- See all: GET /api/packages

---

## 🆘 Quick Troubleshooting

### Server won't start?
```bash
# Check if port 5000 is free
netstat -ano | findstr :5000

# Kill process if needed
taskkill /PID <PID> /F
```

### Database error?
```bash
# Test connection
mysql -u root -p laboratory -e "SELECT 1"

# Check .env file
type backend\.env
```

### Tests fail?
```bash
# Make sure server is running first
curl http://localhost:5000/api/health

# Then run tests
node test-new-features.js
```

---

## 🎉 Success!

If you see:
- ✅ Server running on port 5000
- ✅ All tests passing
- ✅ Can create invoices

**You're ready to build!** 🚀

Next: Read **IMPLEMENTATION_GUIDE.md** to complete remaining modules.

---

## 📞 Need More Help?

1. **START_HERE.md** - Complete roadmap
2. **README_UPGRADE.md** - Full overview
3. **QUICK_START.md** - Detailed setup
4. **API_DOCUMENTATION.md** - API reference

---

**That's it! You're up and running in 5 minutes.** 🎊
