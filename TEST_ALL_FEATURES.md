# 🧪 TEST ALL FEATURES - Step by Step

## 🚀 START THE SYSTEM

### Step 1: Start Backend
```bash
cd backend
node complete-server.js
```
✅ You should see: "COMPLETE SERVER RUNNING!"

### Step 2: Start Frontend
```bash
cd laboratory
npm start
```
✅ Browser opens at http://localhost:3000

### Step 3: Login
- Username: **admin**
- Password: **admin123**

---

## ✅ TEST CHECKLIST

### 1. TEST PATIENTS PAGE
1. Click **"Patients"** in sidebar
2. Page loads ✓
3. Click **"Add Patient"** button
4. Modal opens ✓
5. Fill form:
   - Name: John Doe
   - Phone: 9876543210
   - Email: john@test.com
   - Gender: Male
   - Age: 30
   - Address: Test Address
6. Click **"Add Patient"**
7. Alert shows "Patient added successfully!" ✓
8. Patient appears in table ✓
9. Search for "John" in search box ✓
10. Patient filters correctly ✓

**Status: [ ] PASS [ ] FAIL**

---

### 2. TEST TESTS PAGE
1. Click **"Tests"** in sidebar
2. Page loads ✓
3. Click **"Add Test"** button
4. Modal opens ✓
5. Fill form:
   - Test Name: Complete Blood Count
   - Test Code: CBC001
   - Category: Hematology
   - Price: 500
   - TAT: 24
   - Sample Type: Blood
   - Description: Full blood analysis
6. Click **"Add Test"**
7. Alert shows "Test added successfully!" ✓
8. Test appears in table ✓
9. Filter by category "Hematology" ✓
10. Test shows correctly ✓

**Status: [ ] PASS [ ] FAIL**

---

### 3. TEST ITEMS PAGE
1. Click **"Items"** in sidebar
2. Page loads ✓
3. Click **"Add Item"** button
4. Modal opens ✓
5. Fill form:
   - Item Name: Blood Collection Tube
   - Item Code: BCT001
   - Category: Consumable
   - Unit: Pieces
   - Current Stock: 100
   - Min Stock Level: 20
   - Unit Price: 10
   - Description: Standard blood tube
   - Active: ✓ (checked)
6. Click **"Add Item"**
7. Alert shows "Item added successfully!" ✓
8. Item appears in table ✓
9. Stock status shows "In Stock" (green) ✓
10. Filter by category "Consumable" ✓

**Status: [ ] PASS [ ] FAIL**

---

### 4. TEST BILLING PAGE (INVOICES)
1. Click **"Billing"** in sidebar
2. Page loads (no more "Loading invoices..." stuck) ✓
3. Statistics cards show (even if 0) ✓
4. Click **"New Invoice"** button
5. Modal opens ✓
6. Fill form:
   - Select Patient: John Doe
   - Select Test: Complete Blood Count
   - Total Amount: 500
   - Paid Amount: 300
   - Payment Method: Cash
   - Payment Status: Auto-calculated to "Partial"
7. Balance shows: ₹200 ✓
8. Click **"Create Invoice"**
9. Alert shows "Invoice created successfully!" ✓
10. Invoice appears in table ✓
11. Invoice number shows (INV-00001) ✓
12. Payment status badge shows "partial" (yellow) ✓

**Status: [ ] PASS [ ] FAIL**

---

### 5. TEST DASHBOARD
1. Click **"Dashboard"** in sidebar
2. Page loads ✓
3. Statistics cards show updated numbers ✓
4. Revenue chart displays ✓
5. Recent invoices table shows ✓
6. Quick actions work ✓

**Status: [ ] PASS [ ] FAIL**

---

### 6. TEST ALL OTHER PAGES
1. Click **"EMI"** - Page loads ✓
2. Click **"Ledger"** - Page loads ✓
3. Click **"Inventory"** - Page loads ✓
4. Click **"Doctors"** - Page loads ✓
5. Click **"Packages"** - Page loads ✓
6. Click **"Reports"** - Page loads ✓
7. Click **"Settings"** - Page loads ✓

**Status: [ ] PASS [ ] FAIL**

---

## 🔍 DETAILED BUTTON TESTS

### Test Every Button on Patients Page
- [ ] "Add Patient" button opens modal
- [ ] "Cancel" button closes modal
- [ ] "Add Patient" submit button saves data
- [ ] Search input filters results
- [ ] Gender dropdown works
- [ ] All input fields accept text

### Test Every Button on Tests Page
- [ ] "Add Test" button opens modal
- [ ] "Cancel" button closes modal
- [ ] "Add Test" submit button saves data
- [ ] Category dropdown works
- [ ] Sample type dropdown works
- [ ] Price input accepts numbers

### Test Every Button on Items Page
- [ ] "Add Item" button opens modal
- [ ] "Cancel" button closes modal
- [ ] "Add Item" submit button saves data
- [ ] Category dropdown works
- [ ] Unit dropdown works
- [ ] Active checkbox toggles

### Test Every Button on Billing Page
- [ ] "New Invoice" button opens modal
- [ ] "Cancel" button closes modal
- [ ] "Create Invoice" submit button saves data
- [ ] Patient dropdown shows patients
- [ ] Test dropdown shows tests
- [ ] Payment method dropdown works
- [ ] Balance auto-calculates

---

## 🎯 EXPECTED RESULTS

### After Adding 1 Patient, 1 Test, 1 Item, 1 Invoice:

**Dashboard Should Show:**
- Total Patients: 1
- Total Tests: 1
- Total Items: 1
- Total Invoices: 1
- Total Revenue: ₹500

**Patients Page:**
- 1 patient in table
- Search works
- Filter works

**Tests Page:**
- 1 test in table
- Category filter works
- Price displays correctly

**Items Page:**
- 1 item in table
- Stock status shows
- Category filter works

**Billing Page:**
- 1 invoice in table
- Invoice number: INV-00001
- Payment status: Partial
- Balance: ₹200

---

## 🐛 TROUBLESHOOTING

### Issue: "Loading invoices..." stuck
**Fix**: Backend not running or wrong endpoint
**Check**: Is `complete-server.js` running?

### Issue: Modal doesn't open
**Fix**: Check browser console (F12)
**Check**: Any JavaScript errors?

### Issue: Form doesn't submit
**Fix**: Check if all required fields filled
**Check**: Are dropdowns populated?

### Issue: Data doesn't appear
**Fix**: Refresh page
**Check**: Check backend console for errors

### Issue: Dropdown is empty
**Fix**: Make sure you added data first
**Example**: Add patients before creating invoice

---

## ✅ SUCCESS CRITERIA

All tests PASS when:
- ✅ All pages load without errors
- ✅ All buttons open modals
- ✅ All forms submit successfully
- ✅ All data appears in tables
- ✅ All searches work
- ✅ All filters work
- ✅ No console errors
- ✅ Backend logs show success messages

---

## 📊 FINAL VERIFICATION

After completing all tests, you should have:
- 1 Patient (John Doe)
- 1 Test (Complete Blood Count)
- 1 Item (Blood Collection Tube)
- 1 Invoice (INV-00001)

All visible in their respective pages with:
- Correct data
- Proper formatting
- Working filters
- Functional buttons

---

## 🎉 IF ALL TESTS PASS

**Congratulations!** Your system is fully functional:
- ✅ Backend working
- ✅ Frontend working
- ✅ All CRUD operations working
- ✅ All buttons working
- ✅ All inputs working
- ✅ All forms working

**You're ready to use the system!** 🚀

---

## 📞 QUICK REFERENCE

**Start Backend**: `cd backend && node complete-server.js`
**Start Frontend**: `cd laboratory && npm start`
**Login**: admin / admin123
**Backend URL**: http://localhost:5000
**Frontend URL**: http://localhost:3000

**Test in this order:**
1. Patients (add first)
2. Tests (add second)
3. Items (add third)
4. Billing (needs patients & tests)
5. Other pages (view only)

**Happy Testing!** 🎊
