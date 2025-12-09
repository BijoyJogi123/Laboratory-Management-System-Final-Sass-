# ✅ TEST GROUPS/PACKAGES FEATURE

## What's Added

Laboratory tests can now be:
1. **Single Test**: Individual test (e.g., "Blood Sugar")
2. **Group Test (Package)**: Contains multiple sub-tests (e.g., "Complete Blood Count")

## Database Changes ✅

### New Columns in `lab_test_master`:
- `test_type` ENUM('single', 'group') - Type of test
- `parent_test_id` INT - Links sub-tests to parent group
- `price` DECIMAL(10,2) - Test price

### Structure:
```
Single Test:
- test_id: 1
- test_name: "Blood Sugar"
- test_type: "single"
- parent_test_id: NULL
- price: 150.00

Group Test (Package):
- test_id: 2
- test_name: "Complete Blood Count (CBC)"
- test_type: "group"
- parent_test_id: NULL
- price: 500.00

Sub-Tests (under CBC):
- test_id: 3
- test_name: "RBC Count"
- test_type: "single"
- parent_test_id: 2  ← Links to CBC
- price: 0.00

- test_id: 4
- test_name: "WBC Count"
- test_type: "single"
- parent_test_id: 2  ← Links to CBC
- price: 0.00

- test_id: 5
- test_name: "Hemoglobin"
- test_type: "single"
- parent_test_id: 2  ← Links to CBC
- price: 0.00
```

## Frontend Implementation Needed

### Test Form (Add/Edit Test)

Add radio buttons to select test type:

```jsx
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Test Type *
  </label>
  <div className="flex gap-4">
    <label className="flex items-center">
      <input
        type="radio"
        name="test_type"
        value="single"
        checked={formData.test_type === 'single'}
        onChange={handleInputChange}
        className="mr-2"
      />
      Single Test
    </label>
    <label className="flex items-center">
      <input
        type="radio"
        name="test_type"
        value="group"
        checked={formData.test_type === 'group'}
        onChange={handleInputChange}
        className="mr-2"
      />
      Group Test (Package)
    </label>
  </div>
</div>

{/* If group test, show sub-tests section */}
{formData.test_type === 'group' && (
  <div className="border-t pt-4 mt-4">
    <h4 className="font-medium mb-3">Sub-Tests</h4>
    <button
      type="button"
      onClick={handleAddSubTest}
      className="btn-secondary mb-3"
    >
      + Add Sub-Test
    </button>
    
    {subTests.map((subTest, index) => (
      <div key={index} className="flex gap-2 mb-2">
        <input
          type="text"
          placeholder="Sub-test name"
          value={subTest.name}
          onChange={(e) => handleSubTestChange(index, 'name', e.target.value)}
          className="input-field flex-1"
        />
        <input
          type="text"
          placeholder="Unit"
          value={subTest.unit}
          onChange={(e) => handleSubTestChange(index, 'unit', e.target.value)}
          className="input-field w-32"
        />
        <input
          type="text"
          placeholder="Ref Value"
          value={subTest.ref_value}
          onChange={(e) => handleSubTestChange(index, 'ref_value', e.target.value)}
          className="input-field w-32"
        />
        <button
          type="button"
          onClick={() => handleRemoveSubTest(index)}
          className="text-red-600 hover:text-red-700"
        >
          Remove
        </button>
      </div>
    ))}
  </div>
)}
```

### Test List Display

Show group tests with expandable sub-tests:

```jsx
{test.test_type === 'group' ? (
  <div>
    <div className="flex items-center gap-2">
      <span className="badge badge-info">Group</span>
      <span className="font-medium">{test.test_name}</span>
      <button onClick={() => toggleSubTests(test.test_id)}>
        {expandedGroups.includes(test.test_id) ? '▼' : '▶'}
      </button>
    </div>
    
    {expandedGroups.includes(test.test_id) && (
      <div className="ml-8 mt-2 text-sm text-gray-600">
        {test.subTests.map(subTest => (
          <div key={subTest.test_id}>
            • {subTest.test_name}
          </div>
        ))}
      </div>
    )}
  </div>
) : (
  <span>{test.test_name}</span>
)}
```

## Backend API Updates Needed

### Get Tests with Sub-Tests

```javascript
getAllTests: async (tenantId) => {
  // Get all tests
  const [tests] = await db.query(`
    SELECT * FROM lab_test_master 
    WHERE parent_test_id IS NULL
    ORDER BY test_name
  `);
  
  // For each group test, get sub-tests
  for (let test of tests) {
    if (test.test_type === 'group') {
      const [subTests] = await db.query(`
        SELECT * FROM lab_test_master 
        WHERE parent_test_id = ?
        ORDER BY test_name
      `, [test.test_id]);
      test.subTests = subTests;
    }
  }
  
  return tests;
}
```

### Create Group Test with Sub-Tests

```javascript
createGroupTest: async (testData) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    
    // Create parent group
    const [result] = await connection.query(`
      INSERT INTO lab_test_master (test_name, test_type, price)
      VALUES (?, 'group', ?)
    `, [testData.test_name, testData.price]);
    
    const groupId = result.insertId;
    
    // Create sub-tests
    for (let subTest of testData.subTests) {
      await connection.query(`
        INSERT INTO lab_test_master 
        (test_name, unit, ref_value, test_type, parent_test_id, price)
        VALUES (?, ?, ?, 'single', ?, 0)
      `, [subTest.name, subTest.unit, subTest.ref_value, groupId]);
    }
    
    await connection.commit();
    return { groupId, success: true };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
```

## Use Cases

### Example 1: Complete Blood Count (CBC)
- **Group**: CBC (₹500)
  - RBC Count
  - WBC Count
  - Hemoglobin
  - Platelet Count
  - Hematocrit

### Example 2: Lipid Profile
- **Group**: Lipid Profile (₹800)
  - Total Cholesterol
  - HDL Cholesterol
  - LDL Cholesterol
  - Triglycerides
  - VLDL

### Example 3: Single Test
- **Single**: Blood Sugar (₹150)

## Benefits

✅ **Organized**: Group related tests together
✅ **Pricing**: Set package price for group tests
✅ **Flexible**: Can have single tests or packages
✅ **Scalable**: Unlimited sub-tests per group
✅ **Reports**: Generate reports for entire package

## Status

- ✅ Database schema updated
- ✅ Columns added (test_type, parent_test_id, price)
- ✅ Foreign key constraints added
- ⏳ Frontend UI needs implementation
- ⏳ Backend API needs updates

**Database is ready! Now implement the frontend UI.**
