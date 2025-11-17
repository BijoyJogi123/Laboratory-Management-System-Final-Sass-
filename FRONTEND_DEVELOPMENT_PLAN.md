# 🎨 FRONTEND DEVELOPMENT PLAN

## 🎯 Overview

With the backend 100% complete, it's time to build the frontend UI. We'll create React components using Tailwind CSS for all 9 modules.

---

## 📋 PRIORITY ORDER

### Phase 1: Core Business Features (Week 1)
1. **Billing UI** - Most important for business
2. **EMI Management UI** - Critical for payments
3. **Ledger UI** - Financial tracking

### Phase 2: Operations (Week 2)
4. **Inventory UI** - Stock management
5. **Doctor UI** - Commission tracking
6. **Test Order UI** - Workflow management

### Phase 3: Customer Facing (Week 3)
7. **Patient Portal UI** - Customer interface
8. **Package UI** - Test bundles

### Phase 4: Advanced (Week 4)
9. **Template UI** - Report customization

---

## 🏗️ FOLDER STRUCTURE

```
laboratory/src/
├── pages/
│   ├── billing/
│   │   ├── InvoiceList.js
│   │   ├── CreateInvoice.js
│   │   ├── InvoiceDetails.js
│   │   ├── EMIManagement.js
│   │   └── PaymentModal.js
│   ├── ledger/
│   │   ├── PartyLedger.js
│   │   └── LedgerReport.js
│   ├── inventory/
│   │   ├── InventoryList.js
│   │   ├── StockManagement.js
│   │   └── LowStockAlerts.js
│   ├── doctors/
│   │   ├── DoctorList.js
│   │   └── CommissionReport.js
│   ├── orders/
│   │   ├── OrderWorkflow.js
│   │   └── OrderTracking.js
│   ├── packages/
│   │   ├── PackageList.js
│   │   └── CreatePackage.js
│   ├── portal/
│   │   ├── PortalLogin.js
│   │   ├── PortalDashboard.js
│   │   ├── MyBills.js
│   │   └── MyReports.js
│   └── templates/
│       ├── TemplateList.js
│       └── TemplateEditor.js
├── components/
│   ├── common/
│   │   ├── DataTable.js
│   │   ├── Modal.js
│   │   ├── StatusBadge.js
│   │   └── DateRangePicker.js
│   ├── billing/
│   │   ├── InvoiceForm.js
│   │   └── PaymentForm.js
│   └── charts/
│       └── StatisticsCard.js
└── services/
    └── api.js (centralized API calls)
```

---

## 🎨 COMPONENT TEMPLATES

### 1. Invoice List Component

```javascript
// laboratory/src/pages/billing/InvoiceList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    payment_status: '',
    search: ''
  });

  useEffect(() => {
    fetchInvoices();
  }, [filters]);

  const fetchInvoices = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/billing/invoices', {
        headers: { Authorization: `Bearer ${token}` },
        params: filters
      });
      setInvoices(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Invoices</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Create Invoice
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Search..."
            className="border rounded px-3 py-2"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
          <select
            className="border rounded px-3 py-2"
            value={filters.payment_status}
            onChange={(e) => setFilters({ ...filters, payment_status: e.target.value })}
          >
            <option value="">All Status</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
            <option value="partial">Partial</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice #</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {invoices.map((invoice) => (
              <tr key={invoice.invoice_id}>
                <td className="px-6 py-4 whitespace-nowrap">{invoice.invoice_number}</td>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(invoice.invoice_date).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">{invoice.patient_name}</td>
                <td className="px-6 py-4 whitespace-nowrap">₹{invoice.total_amount}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    invoice.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                    invoice.payment_status === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {invoice.payment_status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                  <button className="text-green-600 hover:text-green-900">Pay</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvoiceList;
```

---

## 🔧 SETUP STEPS

### 1. Install Dependencies
```bash
cd laboratory
npm install axios react-router-dom date-fns
```

### 2. Create API Service
```javascript
// laboratory/src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL
});

// Add token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### 3. Update App.js Routes
```javascript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import InvoiceList from './pages/billing/InvoiceList';
import EMIManagement from './pages/billing/EMIManagement';
// ... other imports

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/billing/invoices" element={<InvoiceList />} />
        <Route path="/billing/emi" element={<EMIManagement />} />
        {/* Add more routes */}
      </Routes>
    </BrowserRouter>
  );
}
```

---

## 📝 DEVELOPMENT CHECKLIST

### Week 1: Billing & EMI
- [ ] Create InvoiceList component
- [ ] Create CreateInvoice component
- [ ] Create InvoiceDetails component
- [ ] Create PaymentModal component
- [ ] Create EMIManagement component
- [ ] Create EMISchedule component
- [ ] Test all billing flows

### Week 2: Ledger & Inventory
- [ ] Create PartyLedger component
- [ ] Create LedgerReport component
- [ ] Create InventoryList component
- [ ] Create StockManagement component
- [ ] Create LowStockAlerts component
- [ ] Test inventory flows

### Week 3: Doctors & Orders
- [ ] Create DoctorList component
- [ ] Create CommissionReport component
- [ ] Create OrderWorkflow component
- [ ] Create OrderTracking component
- [ ] Test order flows

### Week 4: Portal & Templates
- [ ] Create PortalLogin component
- [ ] Create PortalDashboard component
- [ ] Create MyBills component
- [ ] Create MyReports component
- [ ] Create TemplateList component
- [ ] Create TemplateEditor component

---

## 🎨 UI/UX GUIDELINES

### Colors
- Primary: Blue (#2563EB)
- Success: Green (#10B981)
- Warning: Yellow (#F59E0B)
- Danger: Red (#EF4444)
- Gray: (#6B7280)

### Components
- Use Tailwind CSS classes
- Consistent spacing (p-4, p-6, mb-4, mb-6)
- Rounded corners (rounded-lg)
- Shadows for cards (shadow, shadow-lg)
- Hover effects on buttons

### Responsive
- Mobile-first approach
- Use grid/flex layouts
- Breakpoints: sm, md, lg, xl

---

## 🧪 TESTING STRATEGY

1. **Component Testing**
   - Test each component in isolation
   - Verify API calls work
   - Check error handling

2. **Integration Testing**
   - Test complete workflows
   - Verify data flow
   - Check navigation

3. **User Testing**
   - Test with real users
   - Gather feedback
   - Iterate

---

## 📚 RESOURCES

### Documentation
- React: https://react.dev/
- Tailwind CSS: https://tailwindcss.com/
- Axios: https://axios-http.com/

### Component Libraries (Optional)
- Headless UI: https://headlessui.com/
- React Icons: https://react-icons.github.io/
- Chart.js: https://www.chartjs.org/

---

## 🚀 GET STARTED

```bash
# 1. Make sure backend is running
cd backend
node server-upgraded.js

# 2. Start frontend
cd laboratory
npm start

# 3. Create your first component
# Copy the InvoiceList template above
# Save to: laboratory/src/pages/billing/InvoiceList.js

# 4. Add route to App.js

# 5. Test in browser
# Navigate to: http://localhost:3000/billing/invoices
```

---

## 💡 TIPS

1. **Start Simple** - Build basic list views first
2. **Reuse Components** - Create common components (DataTable, Modal, etc.)
3. **Test Often** - Test each component as you build
4. **Use Templates** - Copy and modify the templates provided
5. **Ask for Help** - Refer to documentation when stuck

---

## 🎯 SUCCESS CRITERIA

Frontend is complete when:
- [ ] All 9 modules have UI
- [ ] Can perform all CRUD operations
- [ ] Responsive on mobile/tablet/desktop
- [ ] Error handling works
- [ ] Loading states implemented
- [ ] User-friendly and intuitive

---

**Ready to build? Start with the Billing UI - it's the most important!** 🚀
