-- =====================================================
-- LABORATORY MANAGEMENT SYSTEM - DATABASE UPGRADE
-- Multi-Tenant SaaS with Advanced Billing & Features
-- =====================================================

-- =====================================================
-- PART 1: MULTI-TENANT ARCHITECTURE
-- =====================================================

-- Tenants (Labs/Organizations)
CREATE TABLE IF NOT EXISTS tenants (
    tenant_id INT PRIMARY KEY AUTO_INCREMENT,
    tenant_name VARCHAR(255) NOT NULL,
    tenant_code VARCHAR(50) UNIQUE NOT NULL,
    contact_person VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'India',
    pincode VARCHAR(10),
    gstin VARCHAR(20),
    pan VARCHAR(20),
    logo_url VARCHAR(500),
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    subscription_plan_id INT,
    subscription_start_date DATE,
    subscription_end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_tenant_code (tenant_code),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Subscription Plans
CREATE TABLE IF NOT EXISTS subscription_plans (
    plan_id INT PRIMARY KEY AUTO_INCREMENT,
    plan_name VARCHAR(100) NOT NULL,
    plan_code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    duration_months INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    max_users INT DEFAULT 5,
    max_patients INT DEFAULT 1000,
    max_tests_per_month INT DEFAULT 500,
    max_storage_gb INT DEFAULT 10,
    features JSON,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tenant Subscriptions History
CREATE TABLE IF NOT EXISTS tenant_subscriptions (
    subscription_id INT PRIMARY KEY AUTO_INCREMENT,
    tenant_id INT NOT NULL,
    plan_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
    payment_date DATETIME,
    payment_method VARCHAR(50),
    transaction_id VARCHAR(100),
    invoice_number VARCHAR(50),
    auto_renew BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    FOREIGN KEY (plan_id) REFERENCES subscription_plans(plan_id),
    INDEX idx_tenant_subscription (tenant_id, end_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- PART 2: BILLING SYSTEM
-- =====================================================

-- Invoices/Bills
CREATE TABLE IF NOT EXISTS invoices (
    invoice_id INT PRIMARY KEY AUTO_INCREMENT,
    tenant_id INT NOT NULL,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    invoice_date DATE NOT NULL,
    due_date DATE,
    patient_id INT,
    patient_name VARCHAR(255),
    patient_contact VARCHAR(20),
    patient_email VARCHAR(255),
    patient_address TEXT,
    subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    paid_amount DECIMAL(10,2) DEFAULT 0,
    balance_amount DECIMAL(10,2) DEFAULT 0,
    payment_type ENUM('full', 'partial', 'emi') DEFAULT 'full',
    payment_status ENUM('unpaid', 'partial', 'paid', 'overdue') DEFAULT 'unpaid',
    notes TEXT,
    terms_conditions TEXT,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    INDEX idx_invoice_number (invoice_number),
    INDEX idx_tenant_invoice (tenant_id, invoice_date),
    INDEX idx_payment_status (payment_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Invoice Line Items
CREATE TABLE IF NOT EXISTS invoice_items (
    item_id INT PRIMARY KEY AUTO_INCREMENT,
    invoice_id INT NOT NULL,
    item_type ENUM('test', 'service', 'charge', 'discount', 'custom') NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    description TEXT,
    quantity INT DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    discount_percent DECIMAL(5,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    tax_percent DECIMAL(5,2) DEFAULT 0,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    test_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (invoice_id) REFERENCES invoices(invoice_id) ON DELETE CASCADE,
    INDEX idx_invoice_items (invoice_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- EMI/Installment Plans
CREATE TABLE IF NOT EXISTS emi_plans (
    emi_plan_id INT PRIMARY KEY AUTO_INCREMENT,
    tenant_id INT NOT NULL,
    invoice_id INT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    down_payment DECIMAL(10,2) DEFAULT 0,
    emi_amount DECIMAL(10,2) NOT NULL,
    number_of_installments INT NOT NULL,
    frequency ENUM('daily', 'weekly', 'monthly', 'custom') DEFAULT 'monthly',
    interest_rate DECIMAL(5,2) DEFAULT 0,
    interest_amount DECIMAL(10,2) DEFAULT 0,
    start_date DATE NOT NULL,
    status ENUM('active', 'completed', 'defaulted', 'cancelled') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    FOREIGN KEY (invoice_id) REFERENCES invoices(invoice_id) ON DELETE CASCADE,
    INDEX idx_tenant_emi (tenant_id, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- EMI Installments
CREATE TABLE IF NOT EXISTS emi_installments (
    installment_id INT PRIMARY KEY AUTO_INCREMENT,
    emi_plan_id INT NOT NULL,
    installment_number INT NOT NULL,
    due_date DATE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    paid_amount DECIMAL(10,2) DEFAULT 0,
    payment_date DATETIME,
    status ENUM('pending', 'paid', 'overdue', 'partial') DEFAULT 'pending',
    payment_mode VARCHAR(50),
    transaction_id VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (emi_plan_id) REFERENCES emi_plans(emi_plan_id) ON DELETE CASCADE,
    INDEX idx_emi_installments (emi_plan_id, due_date),
    INDEX idx_due_date (due_date, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Payment Transactions
CREATE TABLE IF NOT EXISTS payment_transactions (
    transaction_id INT PRIMARY KEY AUTO_INCREMENT,
    tenant_id INT NOT NULL,
    invoice_id INT,
    emi_installment_id INT,
    transaction_number VARCHAR(50) UNIQUE NOT NULL,
    transaction_date DATETIME NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_mode ENUM('cash', 'card', 'upi', 'netbanking', 'cheque', 'other') NOT NULL,
    payment_reference VARCHAR(100),
    received_by INT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    FOREIGN KEY (invoice_id) REFERENCES invoices(invoice_id) ON DELETE SET NULL,
    FOREIGN KEY (emi_installment_id) REFERENCES emi_installments(installment_id) ON DELETE SET NULL,
    INDEX idx_tenant_transaction (tenant_id, transaction_date),
    INDEX idx_transaction_number (transaction_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Party Ledger
CREATE TABLE IF NOT EXISTS party_ledger (
    ledger_id INT PRIMARY KEY AUTO_INCREMENT,
    tenant_id INT NOT NULL,
    party_id INT,
    party_name VARCHAR(255) NOT NULL,
    party_type ENUM('patient', 'doctor', 'supplier', 'other') NOT NULL,
    entry_date DATE NOT NULL,
    voucher_type ENUM('invoice', 'payment', 'receipt', 'journal', 'credit_note', 'debit_note') NOT NULL,
    voucher_number VARCHAR(50),
    invoice_number VARCHAR(50),
    payment_mode VARCHAR(50),
    credit_amount DECIMAL(10,2) DEFAULT 0,
    debit_amount DECIMAL(10,2) DEFAULT 0,
    cashback_amount DECIMAL(10,2) DEFAULT 0,
    tds_party DECIMAL(10,2) DEFAULT 0,
    tds_self DECIMAL(10,2) DEFAULT 0,
    balance DECIMAL(10,2) NOT NULL,
    description TEXT,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    INDEX idx_tenant_party (tenant_id, party_id, entry_date),
    INDEX idx_voucher (voucher_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- PART 3: LABORATORY ADVANCED FEATURES
-- =====================================================

-- Test Packages
CREATE TABLE IF NOT EXISTS test_packages (
    package_id INT PRIMARY KEY AUTO_INCREMENT,
    tenant_id INT NOT NULL,
    package_name VARCHAR(255) NOT NULL,
    package_code VARCHAR(50),
    description TEXT,
    category VARCHAR(100),
    total_price DECIMAL(10,2) NOT NULL,
    discounted_price DECIMAL(10,2),
    discount_percent DECIMAL(5,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    INDEX idx_tenant_package (tenant_id, is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Package Tests Mapping
CREATE TABLE IF NOT EXISTS package_tests (
    id INT PRIMARY KEY AUTO_INCREMENT,
    package_id INT NOT NULL,
    test_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (package_id) REFERENCES test_packages(package_id) ON DELETE CASCADE,
    UNIQUE KEY unique_package_test (package_id, test_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Test Order Workflow
CREATE TABLE IF NOT EXISTS test_orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    tenant_id INT NOT NULL,
    patient_id INT NOT NULL,
    test_id INT,
    package_id INT,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    order_date DATETIME NOT NULL,
    sample_collected_date DATETIME,
    in_lab_date DATETIME,
    processing_date DATETIME,
    qa_check_date DATETIME,
    report_ready_date DATETIME,
    status ENUM('ordered', 'sample_collected', 'in_lab', 'processing', 'qa_check', 'report_ready', 'delivered') DEFAULT 'ordered',
    tat_hours INT,
    priority ENUM('normal', 'urgent', 'stat') DEFAULT 'normal',
    assigned_to INT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    INDEX idx_tenant_order (tenant_id, order_date),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Inventory/Consumables
CREATE TABLE IF NOT EXISTS inventory_items (
    item_id INT PRIMARY KEY AUTO_INCREMENT,
    tenant_id INT NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    item_code VARCHAR(50),
    category ENUM('reagent', 'consumable', 'equipment', 'other') NOT NULL,
    unit VARCHAR(50),
    current_stock INT DEFAULT 0,
    min_stock_level INT DEFAULT 0,
    max_stock_level INT,
    unit_price DECIMAL(10,2),
    supplier_name VARCHAR(255),
    expiry_date DATE,
    location VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    INDEX idx_tenant_inventory (tenant_id, is_active),
    INDEX idx_expiry (expiry_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Inventory Transactions
CREATE TABLE IF NOT EXISTS inventory_transactions (
    transaction_id INT PRIMARY KEY AUTO_INCREMENT,
    tenant_id INT NOT NULL,
    item_id INT NOT NULL,
    transaction_type ENUM('purchase', 'usage', 'adjustment', 'return') NOT NULL,
    quantity INT NOT NULL,
    transaction_date DATETIME NOT NULL,
    reference_number VARCHAR(50),
    test_order_id INT,
    notes TEXT,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES inventory_items(item_id) ON DELETE CASCADE,
    INDEX idx_tenant_transaction (tenant_id, transaction_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Referring Doctors
CREATE TABLE IF NOT EXISTS referring_doctors (
    doctor_id INT PRIMARY KEY AUTO_INCREMENT,
    tenant_id INT NOT NULL,
    doctor_name VARCHAR(255) NOT NULL,
    specialization VARCHAR(100),
    qualification VARCHAR(255),
    registration_number VARCHAR(50),
    contact_number VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    commission_type ENUM('percentage', 'fixed', 'none') DEFAULT 'none',
    commission_value DECIMAL(10,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    INDEX idx_tenant_doctor (tenant_id, is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Doctor Commissions
CREATE TABLE IF NOT EXISTS doctor_commissions (
    commission_id INT PRIMARY KEY AUTO_INCREMENT,
    tenant_id INT NOT NULL,
    doctor_id INT NOT NULL,
    invoice_id INT NOT NULL,
    test_amount DECIMAL(10,2) NOT NULL,
    commission_amount DECIMAL(10,2) NOT NULL,
    commission_date DATE NOT NULL,
    payment_status ENUM('pending', 'paid') DEFAULT 'pending',
    payment_date DATE,
    payment_mode VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES referring_doctors(doctor_id) ON DELETE CASCADE,
    FOREIGN KEY (invoice_id) REFERENCES invoices(invoice_id) ON DELETE CASCADE,
    INDEX idx_doctor_commission (doctor_id, payment_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- PART 4: REPORT TEMPLATE DESIGNER
-- =====================================================

-- Report Templates
CREATE TABLE IF NOT EXISTS report_templates (
    template_id INT PRIMARY KEY AUTO_INCREMENT,
    tenant_id INT NOT NULL,
    template_name VARCHAR(255) NOT NULL,
    template_code VARCHAR(50),
    category ENUM('biochemistry', 'hematology', 'pathology', 'radiology', 'histopathology', 'other') NOT NULL,
    template_json JSON NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    version INT DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    INDEX idx_tenant_template (tenant_id, category, is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Template Assets (Images, Logos, Signatures)
CREATE TABLE IF NOT EXISTS template_assets (
    asset_id INT PRIMARY KEY AUTO_INCREMENT,
    tenant_id INT NOT NULL,
    asset_type ENUM('logo', 'header', 'footer', 'signature', 'watermark', 'other') NOT NULL,
    asset_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INT,
    mime_type VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    INDEX idx_tenant_asset (tenant_id, asset_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Template Version History
CREATE TABLE IF NOT EXISTS template_versions (
    version_id INT PRIMARY KEY AUTO_INCREMENT,
    template_id INT NOT NULL,
    version_number INT NOT NULL,
    template_json JSON NOT NULL,
    changes_description TEXT,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (template_id) REFERENCES report_templates(template_id) ON DELETE CASCADE,
    INDEX idx_template_version (template_id, version_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- PART 5: PATIENT PORTAL
-- =====================================================

-- Patient Portal Users
CREATE TABLE IF NOT EXISTS patient_portal_users (
    portal_user_id INT PRIMARY KEY AUTO_INCREMENT,
    tenant_id INT NOT NULL,
    patient_id INT NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    last_login DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    INDEX idx_username (username),
    INDEX idx_tenant_patient (tenant_id, patient_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- PART 6: ACTIVITY LOGS & AUDIT
-- =====================================================

-- Activity Logs
CREATE TABLE IF NOT EXISTS activity_logs (
    log_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    tenant_id INT NOT NULL,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id INT,
    description TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    INDEX idx_tenant_log (tenant_id, created_at),
    INDEX idx_user_log (user_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- PART 7: NOTIFICATIONS & ALERTS
-- =====================================================

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
    notification_id INT PRIMARY KEY AUTO_INCREMENT,
    tenant_id INT NOT NULL,
    user_id INT,
    notification_type ENUM('emi_due', 'payment_received', 'test_ready', 'low_stock', 'subscription_expiry', 'other') NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    is_read BOOLEAN DEFAULT FALSE,
    read_at DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    INDEX idx_user_notification (user_id, is_read, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- SMS/WhatsApp Log
CREATE TABLE IF NOT EXISTS communication_log (
    log_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    tenant_id INT NOT NULL,
    recipient_type ENUM('patient', 'doctor', 'user') NOT NULL,
    recipient_id INT,
    recipient_number VARCHAR(20) NOT NULL,
    message_type ENUM('sms', 'whatsapp', 'email') NOT NULL,
    message_content TEXT NOT NULL,
    status ENUM('pending', 'sent', 'delivered', 'failed') DEFAULT 'pending',
    sent_at DATETIME,
    delivered_at DATETIME,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    INDEX idx_tenant_communication (tenant_id, created_at),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- PART 8: SYSTEM CONFIGURATION
-- =====================================================

-- System Settings
CREATE TABLE IF NOT EXISTS system_settings (
    setting_id INT PRIMARY KEY AUTO_INCREMENT,
    tenant_id INT,
    setting_key VARCHAR(100) NOT NULL,
    setting_value TEXT,
    setting_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_tenant_setting (tenant_id, setting_key),
    INDEX idx_tenant_setting (tenant_id, setting_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- INSERT DEFAULT DATA
-- =====================================================

-- Default Subscription Plans
INSERT INTO subscription_plans (plan_name, plan_code, description, duration_months, price, max_users, max_patients, max_tests_per_month, max_storage_gb, features) VALUES
('Basic', 'BASIC', 'Perfect for small labs', 12, 9999.00, 3, 500, 200, 5, '{"reports": true, "billing": true, "emi": false, "inventory": false, "patient_portal": false}'),
('Professional', 'PRO', 'For growing laboratories', 12, 19999.00, 10, 2000, 1000, 20, '{"reports": true, "billing": true, "emi": true, "inventory": true, "patient_portal": true, "custom_templates": true}'),
('Enterprise', 'ENTERPRISE', 'Unlimited features', 12, 49999.00, 50, 10000, 5000, 100, '{"reports": true, "billing": true, "emi": true, "inventory": true, "patient_portal": true, "custom_templates": true, "api_access": true, "priority_support": true}');

-- =====================================================
-- END OF SCHEMA
-- =====================================================
