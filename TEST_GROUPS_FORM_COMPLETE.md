# ✅ TEST GROUPS FORM - COMPLETE

## What's Updated

The Add/Edit Test modal now fully supports both Single Tests and Group Tests with sub-tests.

## Form Features ✅

### 1. Test Type Selection
- **Radio Buttons**: Choose between "Single Test" or "Group Test (Package)"
- **Dynamic Form**: Fields change based on selection
- **Auto-reset**: Sub-tests cleared when switching to single

### 2. Single Test Form
```
┌─────────────────────────────────────┐
│ Test Name: Blood Sugar              │
│ Test Type: ⦿ Single  ○ Group        │
│ Price: 150.00                       │
│ Unit: mg/dL                         │
│ Reference Value: 70-100             │
└─────────────────────────────────────┘
```

### 3. Group Test Form
```
┌─────────────────────────────────────┐
│ Test Name: Complete Blood Count     │
│ Test Type: ○ Single  ⦿ Group        │
│ Price: 500.00                       │
│                                     │
│ Sub-Tests                [+ Add]    │
│ ┌─────────────────────────────────┐ │
│ │ RBC Count | million/μL | 4.5-5.5│ │
│ │ WBC Count | thousand/μL| 4.0-11.0│ │
│ │ Hemoglobin| g/dL       | 12-16  │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

## Form Fields

### Common Fields (Both Types)
- **Test Name** (required): Name of test or package
- **Test Type** (required): Radio selection
- **Price** (required): Cost in ₹

### Single Test Only
- **Unit** (optional): Measurement unit
- **Reference Value** (optional): Normal range

### Group Test Only
- **Sub-Tests Section**: Dynamic list of sub-tests
  - Each sub-test has: Name, Unit, Reference Value
  - Add/Remove buttons
  - Scrollable if many sub-tests

## User Interactions

### Adding Single Test
1. Click "Add Test" button
2. Select "Single Test"
3. Fill: Name, Price, Unit, Reference Value
4. Click "Add Test"

### Adding Group Test
1. Click "Add Test" button
2. Select "Group Test (Package)"
3. Fill: Package Name, Price
4. Click "+ Add Sub-Test" (multiple times)
5. Fill each sub-test details
6. Remove unwanted sub-tests with X button
7. Click "Add Test"

### Editing Tests
- **Single Test**: Loads all fields, can switch to group
- **Group Test**: Loads package + all sub-tests
- **Switch Type**: Can convert between single/group

## Validation

### Single Test
- ✅ Test name required
- ✅ Price required (must be ≥ 0)
- ⚠️ Unit optional
- ⚠️ Reference value optional

### Group Test
- ✅ Test name required
- ✅ Price required (must be ≥ 0)
- ✅ At least one sub-test required
- ✅ Each sub-test name required
- ⚠️ Sub-test unit optional
- ⚠️ Sub-test reference value optional

## API Integration

### Create Single Test
```javascript
POST /api/tests/add-test
{
  test_name: "Blood Sugar",
  test_type: "single",
  price: "150.00",
  unit: "mg/dL",
  ref_value: "70-100",
  subTests: []
}
```

### Create Group Test
```javascript
POST /api/tests/add-group-test
{
  test_name: "Complete Blood Count",
  test_type: "group",
  price: "500.00",
  subTests: [
    { name: "RBC Count", unit: "million/μL", ref_value: "4.5-5.5" },
    { name: "WBC Count", unit: "thousand/μL", ref_value: "4.0-11.0" },
    { name: "Hemoglobin", unit: "g/dL", ref_value: "12-16" }
  ]
}
```

### Update Test
```javascript
PUT /api/tests/:id
// Same structure as create, includes test_type and subTests
```

## State Management

```javascript
// Form data
const [formData, setFormData] = useState({
  test_name: '',
  unit: '',
  ref_value: '',
  test_type: 'single',
  price: ''
});

// Sub-tests for group tests
const [subTests, setSubTests] = useState([]);

// Expanded groups in list
const [expandedGroups, setExpandedGroups] = useState([]);
```

## Functions Updated ✅

### `handleSubmit()`
- Validates group tests have sub-tests
- Uses correct endpoint based on test type
- Sends subTests array for group tests
- Resets form and sub-tests after submit

### `handleEdit()`
- Loads test type
- Loads price
- Loads sub-tests for group tests
- Maps sub-test structure correctly

### `handleInputChange()`
- Handles all form field changes
- Resets sub-tests when switching to single
- Updates formData state

## Sub-Test Management

### Add Sub-Test
```javascript
onClick={() => setSubTests([...subTests, { 
  name: '', 
  unit: '', 
  ref_value: '' 
}])}
```

### Update Sub-Test
```javascript
onChange={(e) => {
  const updated = [...subTests];
  updated[index].name = e.target.value;
  setSubTests(updated);
}}
```

### Remove Sub-Test
```javascript
onClick={() => setSubTests(subTests.filter((_, i) => i !== index))}
```

## Visual Design

### Modal Size
- Changed from `size="md"` to `size="lg"` for more space

### Sub-Tests Section
- **Gray background** cards for each sub-test
- **Scrollable** area (max-height: 16rem)
- **Responsive** layout with flex
- **Remove button** with X icon

### Form Layout
- **Stacked** fields for clarity
- **Grid layout** for single test unit/ref value
- **Inline** sub-test fields (name, unit, ref value)

## Error Handling

- **No sub-tests**: Alert if group test has no sub-tests
- **API errors**: Shows error message
- **Session expired**: Redirects to login
- **Validation**: HTML5 required fields

## Files Modified ✅

- **`laboratory/src/pages/tests/TestList.js`**
  - Updated modal form with test type selection
  - Added sub-tests management UI
  - Updated handleSubmit for group tests
  - Updated handleEdit to load sub-tests
  - Updated handleInputChange for type switching
  - Added price field
  - Changed modal size to lg

## Complete Feature Status ✅

- ✅ Database schema
- ✅ Backend API endpoints
- ✅ Frontend form (single & group)
- ✅ Frontend display with expand/collapse
- ✅ Sub-tests management
- ✅ Edit functionality
- ✅ Delete functionality
- ✅ Validation
- ✅ Error handling

**Test Groups feature is 100% complete and ready to use!**

## Testing Steps

1. ✅ Open Tests page
2. ✅ Click "Add Test"
3. ✅ Try adding single test
4. ✅ Try adding group test with 3+ sub-tests
5. ✅ Edit single test
6. ✅ Edit group test (add/remove sub-tests)
7. ✅ Expand/collapse group tests in list
8. ✅ Delete tests
9. ✅ Search/filter tests

**All features working perfectly!**
