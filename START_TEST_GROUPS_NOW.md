# 🚀 START USING TEST GROUPS NOW

## Quick Start (3 Steps)

### Step 1: Verify Database ✅
```bash
node test-group-tests-complete.js
```
Expected output: "✅ ALL TESTS PASSED"

### Step 2: Restart Backend ✅
```bash
cd backend
node server.js
```
Wait for: "🚀 Server running on port 5000"

### Step 3: Use Frontend ✅
1. Open: http://localhost:3000/tests
2. Click "Add Test" button
3. Try both test types!

---

## Create Your First Single Test

1. Click **"Add Test"**
2. Select **"Single Test"**
3. Fill in:
   - Test Name: `Blood Sugar`
   - Price: `150`
   - Unit: `mg/dL`
   - Reference Value: `70-100`
4. Click **"Add Test"**
5. ✅ See it in the list with green "Single" badge

---

## Create Your First Group Test (Package)

1. Click **"Add Test"**
2. Select **"Group Test (Package)"**
3. Fill in:
   - Test Name: `Complete Blood Count`
   - Price: `500`
4. Click **"+ Add Sub-Test"** button 3 times
5. Fill sub-tests:
   ```
   Sub-Test 1:
   - Name: RBC Count
   - Unit: million/μL
   - Ref Value: 4.5-5.5

   Sub-Test 2:
   - Name: WBC Count
   - Unit: thousand/μL
   - Ref Value: 4.0-11.0

   Sub-Test 3:
   - Name: Hemoglobin
   - Unit: g/dL
   - Ref Value: 12-16
   ```
6. Click **"Add Test"**
7. ✅ See it with blue "Package" badge and "3 sub-tests"

---

## View Sub-Tests

1. Find your group test in the list
2. Click the **arrow button** (▶) on the left
3. ✅ Expands to show all sub-tests
4. Click arrow again to collapse

---

## Edit Tests

### Edit Single Test
1. Click **pencil icon** on any single test
2. Modify fields
3. Click "Update Test"

### Edit Group Test
1. Click **pencil icon** on group test
2. Modify package name or price
3. Add/remove sub-tests
4. Modify sub-test details
5. Click "Update Test"

---

## Delete Tests

1. Click **trash icon** on any test
2. Confirm deletion
3. ✅ For group tests: All sub-tests deleted automatically

---

## Visual Guide

### Single Test Display
```
┌────────────────────────────────────────────────────┐
│ #1  🧪 Blood Sugar  [Single]  ₹150  mg/dL  70-100 │
└────────────────────────────────────────────────────┘
```

### Group Test Display (Collapsed)
```
┌────────────────────────────────────────────────────┐
│ ▶ #2  📦 CBC Package  [Package]  ₹500  -  -       │
│      3 sub-tests                                   │
└────────────────────────────────────────────────────┘
```

### Group Test Display (Expanded)
```
┌────────────────────────────────────────────────────┐
│ ▼ #2  📦 CBC Package  [Package]  ₹500  -  -       │
│      3 sub-tests                                   │
├────────────────────────────────────────────────────┤
│    #3  → RBC Count        million/μL   4.5-5.5    │
│    #4  → WBC Count        thousand/μL  4.0-11.0   │
│    #5  → Hemoglobin       g/dL         12-16      │
└────────────────────────────────────────────────────┘
```

---

## Common Use Cases

### Laboratory Test Packages
```
Lipid Profile Package (₹800)
├─ Total Cholesterol
├─ HDL Cholesterol
├─ LDL Cholesterol
└─ Triglycerides

Liver Function Test (₹600)
├─ SGOT
├─ SGPT
├─ Bilirubin Total
└─ Alkaline Phosphatase

Thyroid Profile (₹700)
├─ T3
├─ T4
└─ TSH
```

---

## Troubleshooting

### Backend Not Starting?
```bash
# Check if port 5000 is free
netstat -ano | findstr :5000

# Kill process if needed
taskkill /PID <PID> /F

# Restart
node backend/server.js
```

### Database Error?
```bash
# Run migration
node add-test-groups.js

# Verify
node test-group-tests-complete.js
```

### Frontend Not Loading?
```bash
cd laboratory
npm install
npm start
```

---

## API Endpoints Reference

```
POST   /api/tests/add-test          # Create single test
POST   /api/tests/add-group-test    # Create group test
GET    /api/tests/all-tests         # Get all tests
PUT    /api/tests/:id               # Update test
DELETE /api/tests/:id               # Delete test
```

---

## Features Summary

✅ **Single Tests**
- Individual laboratory tests
- Unit and reference value
- Individual pricing

✅ **Group Tests (Packages)**
- Multiple tests bundled together
- Package pricing
- Expandable sub-tests view

✅ **Management**
- Create, Read, Update, Delete
- Search and filter
- Visual indicators

✅ **Data Integrity**
- Foreign key constraints
- Cascade delete
- Transaction support

---

## 🎉 You're Ready!

The Test Groups feature is fully functional and ready to use. Start creating your laboratory test catalog now!

**Need Help?**
- Check: `TEST_GROUPS_COMPLETE_INTEGRATION.md`
- Run test: `node test-group-tests-complete.js`
- View docs: All `TEST_GROUPS_*.md` files
