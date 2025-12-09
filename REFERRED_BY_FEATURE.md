# ✅ REFERRED BY FEATURE ADDED

## What's Added

Added "Referred By" field to both Patients and Invoices/Billing sections.

## Database Changes

### Step 1: Run the SQL Migration

Run this batch file to add the column to database:
```bash
ADD-REFERRED-BY.bat
```

Or manually run:
```sql
ALTER TABLE patients 
ADD COLUMN referred_by VARCHAR(255) DEFAULT NULL AFTER address;

ALTER TABLE invoices 
ADD COLUMN referred_by VARCHAR(255) DEFAULT NULL AFTER patient_address;
```

## Backend Changes (Already Done ✅)

### 1. Patient Model (`backend/models/patientModel.js`)
- Added `referred_by` to INSERT query
- Added `referred_by` to UPDATE query

### 2. Patient Controller (`backend/controllers/patientController.js`)
- Added `referred_by` parameter in addPatient
- Added `referred_by` parameter in updatePatient

### 3. Billing Model (`backend/models/billingModel.js`)
- Added `referred_by` to invoice INSERT query

## Frontend Changes Needed

### 1. Patient Form (Add/Edit)
Location: `laboratory/src/pages/patients/PatientList.js`

Add this input field in the patient form:

```jsx
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Referred By
  </label>
  <input
    type="text"
    name="referred_by"
    value={formData.referred_by || ''}
    onChange={handleInputChange}
    className="input-field w-full"
    placeholder="Enter referrer name (optional)"
  />
</div>
```

### 2. Billing/Invoice Form
Location: `laboratory/src/pages/billing/InvoiceList.js` or similar

Add this input field in the invoice creation form:

```jsx
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Referred By
  </label>
  <input
    type="text"
    name="referred_by"
    value={formData.referred_by || ''}
    onChange={handleInputChange}
    className="input-field w-full"
    placeholder="Enter referrer name (optional)"
  />
</div>
```

### 3. Display in Tables

Add column in patient table:
```jsx
<th>Referred By</th>
...
<td>{patient.referred_by || '-'}</td>
```

Add column in invoice table:
```jsx
<th>Referred By</th>
...
<td>{invoice.referred_by || '-'}</td>
```

## Usage

1. **Run the database migration** first:
   ```bash
   ADD-REFERRED-BY.bat
   ```

2. **Restart the backend** server

3. **Update frontend forms** to include the "Referred By" input field

4. **Test**:
   - Add a new patient with "Referred By" field
   - Create an invoice with "Referred By" field
   - Check if data is saved in database

## Benefits

- Track referral sources for patients
- Track referral sources for invoices
- Useful for commission tracking
- Useful for marketing analytics
- Optional field - won't break existing functionality

## Database Schema

```sql
-- patients table
referred_by VARCHAR(255) DEFAULT NULL

-- invoices table
referred_by VARCHAR(255) DEFAULT NULL
```

Both fields are optional (nullable) so existing records won't be affected.
