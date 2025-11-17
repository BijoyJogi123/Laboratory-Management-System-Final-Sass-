# 🚀 LABORATORY MANAGEMENT SYSTEM - IMPLEMENTATION GUIDE

## 📋 Table of Contents
1. [Database Setup](#database-setup)
2. [Backend Implementation](#backend-implementation)
3. [Frontend Implementation](#frontend-implementation)
4. [Testing](#testing)
5. [Deployment](#deployment)

---

## 1. DATABASE SETUP

### Step 1: Run the Database Schema
```bash
# Connect to MySQL
mysql -u root -p

# Select your database
USE laboratory;

# Run the schema file
source DATABASE_SCHEMA_UPGRADE.sql
```

### Step 2: Verify Tables Created
```sql
SHOW TABLES;

-- You should see these new tables:
-- tenants, subscription_plans, tenant_subscriptions
-- invoices, invoice_items, emi_plans, emi_installments
-- payment_transactions, party_ledger
-- test_packages, package_tests, test_orders
-- inventory_items, inventory_transactions
-- referring_doctors, doctor_commissions
-- report_templates, template_assets, template_versions
-- patient_portal_users, activity_logs
-- notifications, communication_log, system_settings
```

### Step 3: Create Default Tenant
```sql
INSERT INTO tenants (
  tenant_name, tenant_code, email, phone, 
  address, city, state, status, subscription_plan_id
) VALUES (
  'Demo Laboratory', 'DL', 'admin@demolab.com', '9876543210',
  '123 Main Street', 'Mumbai', 'Maharashtra', 'active', 2
);

-- Get the tenant_id (should be 1)
SELECT tenant_id FROM tenants WHERE tenant_code = 'DL';
```

---

## 2. BACKEND IMPLEMENTATION

### Phase 1: Install Dependencies
```bash
cd backend

# Install new packages
npm install multer pdfkit nodemailer twilio razorpay
```

### Phase 2: Update server.js
Add the new routes to your existing `server.js`:

```javascript
// Add after existing routes
const billingRoutes = require('./routes/billingRoutes');
const emiRoutes = require('./routes/emiRoutes');
const ledgerRoutes = require('./routes/ledgerRoutes');
const packageRoutes = require('./routes/packageRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const templateRoutes = require('./routes/templateRoutes');
const testOrderRoutes = require('./routes/testOrderRoutes');
const patientPortalRoutes = require('./routes/patientPortalRoutes');
const tenantRoutes = require('./routes/tenantRoutes');

// Use routes
app.use('/api/billing', billingRoutes);
app.use('/api/emi', emiRoutes);
app.use('/api/ledger', ledgerRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/test-orders', testOrderRoutes);
app.use('/api/portal', patientPortalRoutes);
app.use('/api/tenants', tenantRoutes);
```

### Phase 3: Create Remaining Controllers

I've already created:
- ✅ billingModel.js
- ✅ emiModel.js
- ✅ billingController.js
- ✅ billingRoutes.js

You need to create (I'll provide templates):
- emiController.js
- emiRoutes.js
- ledgerModel.js
- ledgerController.js
- ledgerRoutes.js
- packageModel.js
- packageController.js
- packageRoutes.js
- inventoryModel.js
- inventoryController.js
- inventoryRoutes.js
- doctorModel.js
- doctorController.js
- doctorRoutes.js
- templateModel.js
- templateController.js
- templateRoutes.js
- testOrderModel.js
- testOrderController.js
- testOrderRoutes.js
- patientPortalController.js
- patientPortalRoutes.js
- tenantModel.js
- tenantController.js
- tenantRoutes.js

### Phase 4: Create Services

Create `backend/services/pdfService.js`:
```javascript
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

class PDFService {
  static async generateInvoicePDF(invoice) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50 });
        const filename = `invoice_${invoice.invoice_number.replace(/\//g, '_')}.pdf`;
        const filepath = path.join(__dirname, '../uploads/invoices', filename);

        // Ensure directory exists
        const dir = path.dirname(filepath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }

        const stream = fs.createWriteStream(filepath);
        doc.pipe(stream);

        // Header
        doc.fontSize(20).text('INVOICE', { align: 'center' });
        doc.moveDown();

        // Invoice details
        doc.fontSize(12);
        doc.text(`Invoice Number: ${invoice.invoice_number}`);
        doc.text(`Date: ${invoice.invoice_date}`);
        doc.text(`Patient: ${invoice.patient_name}`);
        doc.moveDown();

        // Items table
        doc.fontSize(10);
        let y = doc.y;
        doc.text('Item', 50, y);
        doc.text('Qty', 250, y);
        doc.text('Price', 350, y);
        doc.text('Total', 450, y);
        doc.moveDown();

        invoice.items.forEach(item => {
          y = doc.y;
          doc.text(item.item_name, 50, y);
          doc.text(item.quantity.toString(), 250, y);
          doc.text(item.unit_price.toFixed(2), 350, y);
          doc.text(item.total_amount.toFixed(2), 450, y);
          doc.moveDown();
        });

        // Totals
        doc.moveDown();
        doc.text(`Subtotal: ₹${invoice.subtotal.toFixed(2)}`, { align: 'right' });
        doc.text(`Discount: ₹${invoice.discount_amount.toFixed(2)}`, { align: 'right' });
        doc.text(`Tax: ₹${invoice.tax_amount.toFixed(2)}`, { align: 'right' });
        doc.fontSize(14).text(`Total: ₹${invoice.total_amount.toFixed(2)}`, { align: 'right' });

        doc.end();

        stream.on('finish', () => {
          resolve(filepath);
        });

        stream.on('error', reject);
      } catch (error) {
        reject(error);
      }
    });
  }

  static async generateLedgerPDF(ledgerData) {
    // Similar implementation for ledger
    // ... (implement based on invoice PDF)
  }
}

module.exports = PDFService;
```

### Phase 5: Create Middleware

Create `backend/middlewares/tenantMiddleware.js`:
```javascript
const db = require('../config/db.config');

const tenantMiddleware = async (req, res, next) => {
  try {
    // Get tenant_id from user (set during login)
    const tenantId = req.user.tenant_id;

    if (!tenantId) {
      return res.status(403).json({
        success: false,
        message: 'No tenant associated with user'
      });
    }

    // Verify tenant is active
    const [tenants] = await db.query(
      'SELECT * FROM tenants WHERE tenant_id = ? AND status = ?',
      [tenantId, 'active']
    );

    if (tenants.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'Tenant not found or inactive'
      });
    }

    req.tenant = tenants[0];
    next();
  } catch (error) {
    console.error('Tenant middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Tenant verification failed'
    });
  }
};

module.exports = tenantMiddleware;
```

---

## 3. FRONTEND IMPLEMENTATION

### Phase 1: Install Dependencies
```bash
cd laboratory

# Install new packages
npm install react-dnd react-dnd-html5-backend react-beautiful-dnd
npm install recharts date-fns react-datepicker
npm install html2canvas jspdf
```

### Phase 2: Create Billing Components

Create `laboratory/src/pages/billing/InvoiceList.js`:
```javascript
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    payment_status: '',
    search: '',
    from_date: '',
    to_date: ''
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
      console.error('Error fetching invoices:', error);
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'partial': return 'bg-yellow-100 text-yellow-800';
      case 'unpaid': return 'bg-red-100 text-red-800';
      case 'overdue': return 'bg-red-200 text-red-900';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

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
        <div className="grid grid-cols-4 gap-4">
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
            <option value="partial">Partial</option>
            <option value="unpaid">Unpaid</option>
            <option value="overdue">Overdue</option>
          </select>
          <input
            type="date"
            className="border rounded px-3 py-2"
            value={filters.from_date}
            onChange={(e) => setFilters({ ...filters, from_date: e.target.value })}
          />
          <input
            type="date"
            className="border rounded px-3 py-2"
            value={filters.to_date}
            onChange={(e) => setFilters({ ...filters, to_date: e.target.value })}
          />
        </div>
      </div>

      {/* Invoice Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Invoice #
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Patient
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Paid
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Balance
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {invoices.map((invoice) => (
              <tr key={invoice.invoice_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                  {invoice.invoice_number}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(invoice.invoice_date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {invoice.patient_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ₹{invoice.total_amount.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ₹{invoice.paid_amount.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ₹{invoice.balance_amount.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(invoice.payment_status)}`}>
                    {invoice.payment_status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                  <button className="text-green-600 hover:text-green-900 mr-3">Pay</button>
                  <button className="text-gray-600 hover:text-gray-900">PDF</button>
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

### Phase 3: Create EMI Management Component

Create `laboratory/src/pages/billing/EMIManagement.js`:
```javascript
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EMIManagement = () => {
  const [emiPlans, setEmiPlans] = useState([]);
  const [dueInstallments, setDueInstallments] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchEMIData();
  }, []);

  const fetchEMIData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch EMI plans
      const plansResponse = await axios.get('http://localhost:5000/api/emi/plans', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEmiPlans(plansResponse.data.data);

      // Fetch due installments
      const dueResponse = await axios.get('http://localhost:5000/api/emi/installments/due', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDueInstallments(dueResponse.data.data);

      // Fetch stats
      const statsResponse = await axios.get('http://localhost:5000/api/emi/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(statsResponse.data.data);
    } catch (error) {
      console.error('Error fetching EMI data:', error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">EMI Management</h1>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-gray-500 text-sm">Total Plans</div>
            <div className="text-2xl font-bold">{stats.total_plans}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-gray-500 text-sm">Pending Installments</div>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending_installments}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-gray-500 text-sm">Overdue</div>
            <div className="text-2xl font-bold text-red-600">{stats.overdue_installments}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-gray-500 text-sm">Total Collected</div>
            <div className="text-2xl font-bold text-green-600">₹{stats.total_paid.toFixed(2)}</div>
          </div>
        </div>
      )}

      {/* Due Installments */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Due Installments (Next 7 Days)</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Invoice #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Installment #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dueInstallments.map((installment) => (
                <tr key={installment.installment_id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {installment.patient_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {installment.invoice_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    #{installment.installment_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {new Date(installment.due_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    ₹{installment.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 mr-2">
                      Pay
                    </button>
                    <button className="text-blue-600 hover:text-blue-900">
                      Remind
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* All EMI Plans */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">All EMI Plans</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Invoice #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Total Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  EMI Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {emiPlans.map((plan) => (
                <tr key={plan.emi_plan_id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {plan.patient_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {plan.invoice_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    ₹{plan.total_amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    ₹{plan.emi_amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {plan.paid_installments}/{plan.total_installments}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      plan.status === 'active' ? 'bg-green-100 text-green-800' :
                      plan.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {plan.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button className="text-blue-600 hover:text-blue-900">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EMIManagement;
```

### Phase 4: Update App Routing

Update `laboratory/src/App.js` to include new routes:
```javascript
import InvoiceList from './pages/billing/InvoiceList';
import EMIManagement from './pages/billing/EMIManagement';
// ... other imports

// Add routes
<Route path="/billing/invoices" element={<PrivateRoute><InvoiceList /></PrivateRoute>} />
<Route path="/billing/emi" element={<PrivateRoute><EMIManagement /></PrivateRoute>} />
```

---

## 4. TESTING

### Test Billing Module
```bash
# Test invoice creation
curl -X POST http://localhost:5000/api/billing/invoices \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "invoice_date": "2024-11-16",
    "patient_name": "Test Patient",
    "total_amount": 1000,
    "items": [{"item_name": "Blood Test", "unit_price": 1000, "total_amount": 1000}]
  }'

# Test EMI creation
curl -X POST http://localhost:5000/api/emi/plans \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "invoice_id": 1,
    "total_amount": 10000,
    "number_of_installments": 10,
    "frequency": "monthly",
    "start_date": "2024-12-01"
  }'
```

---

## 5. DEPLOYMENT

### Production Checklist
- [ ] Update .env with production database credentials
- [ ] Enable HTTPS
- [ ] Set up proper CORS origins
- [ ] Configure file upload limits
- [ ] Set up backup strategy
- [ ] Configure SMS/WhatsApp API keys
- [ ] Set up payment gateway
- [ ] Enable error logging
- [ ] Set up monitoring
- [ ] Configure CDN for static assets

---

## 📞 Support

For issues or questions:
1. Check the API documentation
2. Review error logs
3. Test with Postman/curl
4. Verify database connections

## 🎯 Next Steps

1. Complete all remaining controllers and models
2. Implement PDF generation service
3. Build report template designer (drag-drop)
4. Create patient portal
5. Implement SMS/WhatsApp notifications
6. Add payment gateway integration
7. Build SaaS admin panel
8. Comprehensive testing
9. Deploy to production
