# 🔌 LABORATORY MANAGEMENT SYSTEM - API DOCUMENTATION

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

---

## 📋 BILLING MODULE

### Create Invoice
```http
POST /api/billing/invoices
```

**Request Body:**
```json
{
  "invoice_date": "2024-11-16",
  "due_date": "2024-12-16",
  "patient_id": 1,
  "patient_name": "John Doe",
  "patient_contact": "9876543210",
  "patient_email": "john@example.com",
  "patient_address": "123 Main St",
  "subtotal": 1000.00,
  "discount_amount": 100.00,
  "tax_amount": 90.00,
  "total_amount": 990.00,
  "balance_amount": 990.00,
  "payment_type": "full",
  "notes": "Regular checkup",
  "items": [
    {
      "item_type": "test",
      "item_name": "Blood Test",
      "description": "Complete Blood Count",
      "quantity": 1,
      "unit_price": 500.00,
      "discount_percent": 10,
      "discount_amount": 50.00,
      "tax_percent": 5,
      "tax_amount": 22.50,
      "total_amount": 472.50,
      "test_id": 1
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Invoice created successfully",
  "data": {
    "invoiceId": 1,
    "success": true
  }
}
```

### Get All Invoices
```http
GET /api/billing/invoices?payment_status=unpaid&from_date=2024-01-01&to_date=2024-12-31&search=John&limit=50&offset=0
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "invoice_id": 1,
      "invoice_number": "SL/SL/24-25/001",
      "invoice_date": "2024-11-16",
      "patient_name": "John Doe",
      "total_amount": 990.00,
      "paid_amount": 0.00,
      "balance_amount": 990.00,
      "payment_status": "unpaid",
      "item_count": 2
    }
  ],
  "count": 1
}
```

### Get Invoice by ID
```http
GET /api/billing/invoices/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "invoice_id": 1,
    "invoice_number": "SL/SL/24-25/001",
    "invoice_date": "2024-11-16",
    "patient_name": "John Doe",
    "total_amount": 990.00,
    "items": [
      {
        "item_id": 1,
        "item_name": "Blood Test",
        "quantity": 1,
        "unit_price": 500.00,
        "total_amount": 472.50
      }
    ]
  }
}
```

### Record Payment
```http
POST /api/billing/invoices/:id/payment
```

**Request Body:**
```json
{
  "amount": 500.00,
  "payment_mode": "cash",
  "payment_reference": "CASH001",
  "notes": "Partial payment"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment recorded successfully",
  "data": {
    "success": true,
    "newBalance": 490.00,
    "paymentStatus": "partial"
  }
}
```

### Get Invoice Statistics
```http
GET /api/billing/invoices/stats?from_date=2024-01-01&to_date=2024-12-31
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total_invoices": 150,
    "total_amount": 150000.00,
    "total_paid": 120000.00,
    "total_balance": 30000.00,
    "paid_count": 100,
    "unpaid_count": 30,
    "partial_count": 20
  }
}
```

---

## 💳 EMI MODULE

### Create EMI Plan
```http
POST /api/emi/plans
```

**Request Body:**
```json
{
  "invoice_id": 1,
  "total_amount": 10000.00,
  "down_payment": 2000.00,
  "number_of_installments": 8,
  "frequency": "monthly",
  "interest_rate": 12,
  "start_date": "2024-12-01"
}
```

**Response:**
```json
{
  "success": true,
  "message": "EMI plan created successfully",
  "data": {
    "emiPlanId": 1,
    "emi_amount": 1000.00,
    "interest_amount": 320.00,
    "installments": [
      {
        "installment_number": 1,
        "due_date": "2024-12-01",
        "amount": 1000.00
      }
    ]
  }
}
```

### Get All EMI Plans
```http
GET /api/emi/plans?status=active
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "emi_plan_id": 1,
      "invoice_number": "SL/SL/24-25/001",
      "patient_name": "John Doe",
      "total_amount": 10000.00,
      "emi_amount": 1000.00,
      "total_installments": 8,
      "paid_installments": 3,
      "pending_installments": 5,
      "status": "active"
    }
  ]
}
```

### Get Due Installments
```http
GET /api/emi/installments/due?days_ahead=7
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "installment_id": 5,
      "installment_number": 5,
      "due_date": "2024-11-20",
      "amount": 1000.00,
      "patient_name": "John Doe",
      "patient_contact": "9876543210",
      "status": "pending"
    }
  ]
}
```

### Pay Installment
```http
POST /api/emi/installments/:id/pay
```

**Request Body:**
```json
{
  "amount": 1000.00,
  "payment_mode": "upi",
  "payment_reference": "UPI123456",
  "transaction_number": "TXN-1234567890",
  "notes": "Installment payment"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Installment paid successfully",
  "data": {
    "success": true,
    "status": "paid",
    "remainingAmount": 0
  }
}
```

### Get EMI Statistics
```http
GET /api/emi/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total_plans": 25,
    "total_installments": 200,
    "paid_installments": 120,
    "pending_installments": 60,
    "overdue_installments": 20,
    "total_amount": 200000.00,
    "total_paid": 120000.00
  }
}
```

---

## 📊 LEDGER MODULE

### Get Party Ledger
```http
GET /api/ledger/party/:partyId?from_date=2024-01-01&to_date=2024-12-31
```

**Response:**
```json
{
  "success": true,
  "data": {
    "party_name": "John Doe",
    "opening_balance": 0.00,
    "closing_balance": -5000.00,
    "entries": [
      {
        "ledger_id": 1,
        "entry_date": "2024-11-16",
        "voucher_type": "invoice",
        "invoice_number": "SL/SL/24-25/001",
        "payment_mode": null,
        "credit_amount": 10000.00,
        "debit_amount": 0.00,
        "balance": -10000.00,
        "description": "Invoice generated"
      },
      {
        "ledger_id": 2,
        "entry_date": "2024-11-17",
        "voucher_type": "payment",
        "invoice_number": "SL/SL/24-25/001",
        "payment_mode": "cash",
        "credit_amount": 0.00,
        "debit_amount": 5000.00,
        "balance": -5000.00,
        "description": "Payment received"
      }
    ]
  }
}
```

### Export Ledger PDF
```http
GET /api/ledger/party/:partyId/export/pdf?from_date=2024-01-01&to_date=2024-12-31
```

**Response:** PDF file download

---

## 📦 PACKAGE MODULE

### Create Package
```http
POST /api/packages
```

**Request Body:**
```json
{
  "package_name": "Complete Health Checkup",
  "package_code": "CHC001",
  "description": "Comprehensive health screening",
  "category": "Preventive",
  "total_price": 5000.00,
  "discounted_price": 4000.00,
  "discount_percent": 20,
  "test_ids": [1, 2, 3, 4, 5]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Package created successfully",
  "data": {
    "packageId": 1
  }
}
```

### Get All Packages
```http
GET /api/packages?is_active=true
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "package_id": 1,
      "package_name": "Complete Health Checkup",
      "total_price": 5000.00,
      "discounted_price": 4000.00,
      "test_count": 5,
      "is_active": true
    }
  ]
}
```

---

## 📋 INVENTORY MODULE

### Add Inventory Item
```http
POST /api/inventory/items
```

**Request Body:**
```json
{
  "item_name": "Blood Collection Tube",
  "item_code": "BCT001",
  "category": "consumable",
  "unit": "pieces",
  "current_stock": 500,
  "min_stock_level": 100,
  "unit_price": 5.00,
  "supplier_name": "MedSupply Co",
  "expiry_date": "2025-12-31"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Inventory item added successfully",
  "data": {
    "itemId": 1
  }
}
```

### Get Low Stock Alerts
```http
GET /api/inventory/low-stock
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "item_id": 5,
      "item_name": "Reagent XYZ",
      "current_stock": 50,
      "min_stock_level": 100,
      "shortage": 50
    }
  ]
}
```

### Get Expiring Items
```http
GET /api/inventory/expiring?days=30
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "item_id": 3,
      "item_name": "Test Kit ABC",
      "expiry_date": "2024-12-15",
      "days_to_expiry": 29,
      "current_stock": 25
    }
  ]
}
```

---

## 👨‍⚕️ DOCTOR MODULE

### Add Referring Doctor
```http
POST /api/doctors
```

**Request Body:**
```json
{
  "doctor_name": "Dr. Smith",
  "specialization": "Cardiology",
  "qualification": "MD, DM",
  "registration_number": "MCI12345",
  "contact_number": "9876543210",
  "email": "dr.smith@example.com",
  "commission_type": "percentage",
  "commission_value": 10
}
```

**Response:**
```json
{
  "success": true,
  "message": "Doctor added successfully",
  "data": {
    "doctorId": 1
  }
}
```

### Get Doctor Commission Report
```http
GET /api/doctors/:id/commissions?from_date=2024-01-01&to_date=2024-12-31
```

**Response:**
```json
{
  "success": true,
  "data": {
    "doctor_name": "Dr. Smith",
    "total_tests": 150,
    "total_test_amount": 150000.00,
    "total_commission": 15000.00,
    "paid_commission": 10000.00,
    "pending_commission": 5000.00,
    "commissions": [
      {
        "commission_id": 1,
        "invoice_number": "SL/SL/24-25/001",
        "commission_date": "2024-11-16",
        "test_amount": 1000.00,
        "commission_amount": 100.00,
        "payment_status": "pending"
      }
    ]
  }
}
```

---

## 🎨 TEMPLATE MODULE

### Create Report Template
```http
POST /api/templates
```

**Request Body:**
```json
{
  "template_name": "Blood Test Report",
  "template_code": "BTR001",
  "category": "hematology",
  "template_json": {
    "layout": {
      "header": {
        "logo": "asset_id_1",
        "title": "Blood Test Report",
        "fontSize": 24,
        "alignment": "center"
      },
      "body": {
        "sections": [
          {
            "type": "patient_info",
            "fields": ["name", "age", "gender", "date"]
          },
          {
            "type": "test_results",
            "table": {
              "columns": ["test_name", "result", "unit", "reference_range"],
              "fontSize": 12
            }
          }
        ]
      },
      "footer": {
        "signature": "asset_id_2",
        "text": "Authorized Signature"
      }
    }
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Template created successfully",
  "data": {
    "templateId": 1
  }
}
```

### Upload Template Asset
```http
POST /api/templates/assets
Content-Type: multipart/form-data
```

**Form Data:**
- file: (binary)
- asset_type: "logo"
- asset_name: "Lab Logo"

**Response:**
```json
{
  "success": true,
  "message": "Asset uploaded successfully",
  "data": {
    "assetId": 1,
    "file_path": "/uploads/templates/logo_123456.png"
  }
}
```

### Generate Report
```http
POST /api/templates/:id/generate-report
```

**Request Body:**
```json
{
  "patient_id": 1,
  "test_order_id": 1,
  "test_results": [
    {
      "test_name": "Hemoglobin",
      "result": "14.5",
      "unit": "g/dL",
      "reference_range": "12-16"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Report generated successfully",
  "data": {
    "pdf_url": "/reports/report_123456.pdf"
  }
}
```

---

## 🧪 TEST ORDER MODULE

### Create Test Order
```http
POST /api/test-orders
```

**Request Body:**
```json
{
  "patient_id": 1,
  "test_id": 1,
  "order_number": "ORD-001",
  "order_date": "2024-11-16T10:00:00Z",
  "priority": "normal",
  "tat_hours": 24
}
```

**Response:**
```json
{
  "success": true,
  "message": "Test order created successfully",
  "data": {
    "orderId": 1
  }
}
```

### Update Order Status
```http
PUT /api/test-orders/:id/status
```

**Request Body:**
```json
{
  "status": "sample_collected",
  "notes": "Sample collected at 10:30 AM"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order status updated successfully"
}
```

---

## 🏥 PATIENT PORTAL MODULE

### Patient Registration
```http
POST /api/portal/register
```

**Request Body:**
```json
{
  "patient_id": 1,
  "username": "john_doe",
  "password": "SecurePass123",
  "email": "john@example.com",
  "phone": "9876543210"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "portalUserId": 1
  }
}
```

### Patient Login
```http
POST /api/portal/login
```

**Request Body:**
```json
{
  "username": "john_doe",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Get Patient Bills
```http
GET /api/portal/bills
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "invoice_id": 1,
      "invoice_number": "SL/SL/24-25/001",
      "invoice_date": "2024-11-16",
      "total_amount": 1000.00,
      "paid_amount": 500.00,
      "balance_amount": 500.00,
      "payment_status": "partial"
    }
  ]
}
```

### Get Patient Reports
```http
GET /api/portal/reports
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "report_id": 1,
      "test_name": "Blood Test",
      "report_date": "2024-11-16",
      "status": "ready",
      "pdf_url": "/reports/report_123.pdf"
    }
  ]
}
```

---

## 🏢 TENANT/SAAS MODULE

### Create Tenant
```http
POST /api/tenants
```

**Request Body:**
```json
{
  "tenant_name": "City Lab",
  "tenant_code": "CL",
  "email": "admin@citylab.com",
  "phone": "9876543210",
  "address": "123 Main St",
  "city": "Mumbai",
  "state": "Maharashtra",
  "gstin": "27AABCU9603R1ZM",
  "subscription_plan_id": 2
}
```

**Response:**
```json
{
  "success": true,
  "message": "Tenant created successfully",
  "data": {
    "tenantId": 1
  }
}
```

### Get Activity Logs
```http
GET /api/activity-logs?from_date=2024-11-01&to_date=2024-11-30&user_id=1&action=create_invoice
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "log_id": 1,
      "user_id": 1,
      "action": "create_invoice",
      "entity_type": "invoice",
      "entity_id": 1,
      "description": "Created invoice SL/SL/24-25/001",
      "ip_address": "192.168.1.1",
      "created_at": "2024-11-16T10:30:00Z"
    }
  ]
}
```

---

## 🔔 NOTIFICATION MODULE

### Get Notifications
```http
GET /api/notifications?is_read=false
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "notification_id": 1,
      "notification_type": "emi_due",
      "title": "EMI Payment Due",
      "message": "Your EMI payment of ₹1000 is due on 2024-11-20",
      "priority": "high",
      "is_read": false,
      "created_at": "2024-11-16T10:00:00Z"
    }
  ]
}
```

### Mark Notification as Read
```http
PUT /api/notifications/:id/read
```

**Response:**
```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

---

## Error Responses

All endpoints may return these error responses:

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error",
  "error": "Error details"
}
```
