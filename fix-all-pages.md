# Pages That Need API Fix

The following pages need to be updated to use the authenticated `api` instance:

1. ✅ Dashboard.js - FIXED
2. ✅ TestListPage.js - FIXED
3. ❌ PatientListPage.js - NEEDS FIX
4. ❌ PatientEntryPage.js - NEEDS FIX
5. ❌ ReportEntryPage.js - NEEDS FIX
6. ❌ NewTestCreationPage.js - NEEDS FIX
7. ❌ NewItemCreationPage.js - NEEDS FIX
8. ❌ ItemListPage.js - NEEDS FIX
9. ❌ PatientTestsListPage.js - NEEDS CHECK
10. ❌ TrackingPage.js - NEEDS CHECK

## Fix Pattern:

1. Change import:
```javascript
// Before
import axios from 'axios';

// After
import api from '../utils/api';
```

2. Replace all axios calls:
```javascript
// Before
axios.get(`${process.env.REACT_APP_API_URL}/api/endpoint`)

// After
api.get('/endpoint')
```

3. Same for POST, PUT, DELETE methods