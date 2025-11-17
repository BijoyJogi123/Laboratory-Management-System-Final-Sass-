# 🏗️ LABORATORY MANAGEMENT SYSTEM - COMPLETE ARCHITECTURE

## 📁 Backend Structure

```
backend/
├── config/
│   ├── db.config.js (existing)
│   ├── multer.config.js (NEW - file uploads)
│   └── sms.config.js (NEW - SMS/WhatsApp)
├── controllers/
│   ├── authController.js (existing)
│   ├── billingController.js (NEW)
│   ├── emiController.js (NEW)
│   ├── ledgerController.js (NEW)
│   ├── invoiceController.js (NEW)
│   ├── packageController.js (NEW)
│   ├── inventoryController.js (NEW)
│   ├── doctorController.js (NEW)
│   ├── templateController.js (NEW)
│   ├── patientPortalController.js (NEW)
│   ├── tenantController.js (NEW)
│   ├── subscriptionController.js (NEW)
│   ├── testOrderController.js (NEW)
│   └── notificationController.js (NEW)
├── models/
│   ├── billingModel.js (NEW)
│   ├── emiModel.js (NEW)
│   ├── ledgerModel.js (NEW)
│   ├── packageModel.js (NEW)
│   ├── inventoryModel.js (NEW)
│   ├── doctorModel.js (NEW)
│   ├── templateModel.js (NEW)
│   ├── tenantModel.js (NEW)
│   └── testOrderModel.js (NEW)
├── routes/
│   ├── billingRoutes.js (NEW)
│   ├── emiRoutes.js (NEW)
│   ├── ledgerRoutes.js (NEW)
│   ├── packageRoutes.js (NEW)
│   ├── inventoryRoutes.js (NEW)
│   ├── doctorRoutes.js (NEW)
│   ├── templateRoutes.js (NEW)
│   ├── patientPortalRoutes.js (NEW)
│   ├── tenantRoutes.js (NEW)
│   └── testOrderRoutes.js (NEW)
├── middlewares/
│   ├── authMiddleware.js (existing)
│   ├── tenantMiddleware.js (NEW)
│   ├── roleMiddleware.js (NEW)
│   └── uploadMiddleware.js (NEW)
├── services/
│   ├── pdfService.js (NEW)
│   ├── smsService.js (NEW)
│   ├── emailService.js (NEW)
│   ├── paymentService.js (NEW)
│   └── reportGeneratorService.js (NEW)
└── utils/
    ├── invoiceNumberGenerator.js (NEW)
    ├── emiCalculator.js (NEW)
    └── dateHelper.js (NEW)
```

## 📁 Frontend Structure

```
laboratory/src/
├── pages/
│   ├── Dashboard.js (existing)
│   ├── billing/
│   │   ├── InvoiceList.js (NEW)
│   │   ├── CreateInvoice.js (NEW)
│   │   ├── InvoiceDetails.js (NEW)
│   │   ├── EMIManagement.js (NEW)
│   │   └── PaymentCollection.js (NEW)
│   ├── ledger/
│   │   ├── PartyLedger.js (NEW)
│   │   └── LedgerReport.js (NEW)
│   ├── packages/
│   │   ├── PackageList.js (NEW)
│   │   └── CreatePackage.js (NEW)
│   ├── inventory/
│   │   ├── InventoryList.js (NEW)
│   │   ├── StockManagement.js (NEW)
│   │   └── LowStockAlerts.js (NEW)
│   ├── doctors/
│   │   ├── DoctorList.js (NEW)
│   │   └── CommissionReport.js (NEW)
│   ├── templates/
│   │   ├── TemplateBuilder.js (NEW - Drag & Drop)
│   │   ├── TemplateList.js (NEW)
│   │   └── TemplatePreview.js (NEW)
│   ├── testOrders/
│   │   ├── OrderWorkflow.js (NEW)
│   │   └── OrderTracking.js (NEW)
│   ├── patientPortal/
│   │   ├── PortalLogin.js (NEW)
│   │   ├── PortalDashboard.js (NEW)
│   │   ├── MyBills.js (NEW)
│   │   ├── MyReports.js (NEW)
│   │   └── BookTest.js (NEW)
│   └── admin/
│       ├── TenantManagement.js (NEW)
│       ├── SubscriptionManagement.js (NEW)
│       ├── ActivityLogs.js (NEW)
│       └── SystemSettings.js (NEW)
├── components/
│   ├── billing/
│   │   ├── InvoiceForm.js (NEW)
│   │   ├── EMISchedule.js (NEW)
│   │   ├── PaymentModal.js (NEW)
│   │   └── InvoicePDF.js (NEW)
│   ├── templates/
│   │   ├── DragDropCanvas.js (NEW)
│   │   ├── ElementToolbox.js (NEW)
│   │   ├── PropertyPanel.js (NEW)
│   │   └── TemplatePreview.js (NEW)
│   └── common/
│       ├── DataTable.js (NEW)
│       ├── DateRangePicker.js (NEW)
│       └── StatusBadge.js (NEW)
└── contexts/
    ├── TenantContext.js (NEW)
    └── BillingContext.js (NEW)
```

## 🔌 API Endpoints

### Billing Module
- POST /api/billing/invoices - Create invoice
- GET /api/billing/invoices - List all invoices
- GET /api/billing/invoices/:id - Get invoice details
- PUT /api/billing/invoices/:id - Update invoice
- DELETE /api/billing/invoices/:id - Delete invoice
- POST /api/billing/invoices/:id/payment - Record payment
- GET /api/billing/invoices/:id/pdf - Generate PDF

### EMI Module
- POST /api/emi/plans - Create EMI plan
- GET /api/emi/plans - List EMI plans
- GET /api/emi/plans/:id - Get EMI details
- GET /api/emi/installments/due - Get due installments
- POST /api/emi/installments/:id/pay - Pay installment
- GET /api/emi/reminders - Get payment reminders

### Ledger Module
- GET /api/ledger/party/:id - Get party ledger
- POST /api/ledger/entry - Add ledger entry
- GET /api/ledger/report - Generate ledger report
- GET /api/ledger/export/pdf - Export ledger PDF

### Package Module
- POST /api/packages - Create package
- GET /api/packages - List packages
- GET /api/packages/:id - Get package details
- PUT /api/packages/:id - Update package
- DELETE /api/packages/:id - Delete package

### Inventory Module
- POST /api/inventory/items - Add inventory item
- GET /api/inventory/items - List inventory
- PUT /api/inventory/items/:id - Update item
- POST /api/inventory/transactions - Record transaction
- GET /api/inventory/low-stock - Get low stock alerts
- GET /api/inventory/expiring - Get expiring items

### Doctor Module
- POST /api/doctors - Add doctor
- GET /api/doctors - List doctors
- GET /api/doctors/:id/commissions - Get commissions
- POST /api/doctors/:id/pay-commission - Pay commission
- GET /api/doctors/commission-report - Generate report

### Template Module
- POST /api/templates - Create template
- GET /api/templates - List templates
- GET /api/templates/:id - Get template
- PUT /api/templates/:id - Update template
- POST /api/templates/assets - Upload asset
- GET /api/templates/:id/versions - Get version history
- POST /api/templates/:id/generate-report - Generate report

### Test Order Module
- POST /api/test-orders - Create order
- GET /api/test-orders - List orders
- PUT /api/test-orders/:id/status - Update status
- POST /api/test-orders/:id/notify - Send notification

### Patient Portal Module
- POST /api/portal/register - Register patient
- POST /api/portal/login - Login
- GET /api/portal/dashboard - Get dashboard
- GET /api/portal/bills - Get bills
- GET /api/portal/reports - Get reports
- POST /api/portal/book-test - Book test

### Tenant/SaaS Module
- POST /api/tenants - Create tenant
- GET /api/tenants - List tenants
- GET /api/tenants/:id - Get tenant details
- PUT /api/tenants/:id - Update tenant
- POST /api/subscriptions - Create subscription
- GET /api/subscriptions/:id - Get subscription
- GET /api/activity-logs - Get activity logs

## 🎨 UI Components Priority

### Phase 1 (Core Billing)
1. Invoice Creation Form
2. Invoice List with filters
3. Payment Collection Modal
4. EMI Plan Creator
5. EMI Schedule View

### Phase 2 (Advanced Features)
1. Party Ledger View
2. Package Management
3. Inventory Dashboard
4. Doctor Commission Report

### Phase 3 (Report Designer)
1. Drag-Drop Canvas
2. Element Toolbox
3. Property Panel
4. Template Preview
5. Report Generator

### Phase 4 (Patient Portal & Admin)
1. Patient Portal UI
2. Tenant Management
3. Subscription Dashboard
4. Activity Logs

## 🔐 Authentication & Authorization

### Roles
- Super Admin (SaaS Admin)
- Tenant Admin (Lab Owner)
- Lab Manager
- Lab Technician
- Receptionist
- Patient (Portal User)

### Permissions
- billing.create
- billing.view
- billing.edit
- billing.delete
- emi.manage
- inventory.manage
- reports.generate
- templates.design
- admin.manage

## 📊 Database Relationships

```
tenants (1) ----< (M) users
tenants (1) ----< (M) patients
tenants (1) ----< (M) invoices
invoices (1) ----< (M) invoice_items
invoices (1) ----< (1) emi_plans
emi_plans (1) ----< (M) emi_installments
tenants (1) ----< (M) test_packages
test_packages (M) ----< (M) tests
tenants (1) ----< (M) report_templates
tenants (1) ----< (M) inventory_items
tenants (1) ----< (M) referring_doctors
```

## 🚀 Implementation Order

1. ✅ Database Schema (DONE)
2. Backend Models & Controllers
3. API Routes & Middleware
4. Frontend Components (Billing)
5. Frontend Components (Templates)
6. Frontend Components (Portal)
7. Integration & Testing
8. PDF Generation
9. SMS/WhatsApp Integration
10. Payment Gateway Integration
