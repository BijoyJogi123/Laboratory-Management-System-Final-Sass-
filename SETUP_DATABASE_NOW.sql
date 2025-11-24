-- =====================================================
-- LABORATORY MANAGEMENT SYSTEM - BASIC TABLES SETUP
-- Run this to create missing tables
-- =====================================================

USE laboratory;

-- Create patients table (REQUIRED)
CREATE TABLE IF NOT EXISTS patients (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  patient_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(255),
  gender ENUM('male', 'female', 'other'),
  age INT,
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_phone (phone),
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Ensure users table exists
CREATE TABLE IF NOT EXISTS users (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create tests table (for lab tests)
CREATE TABLE IF NOT EXISTS tests (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  test_name VARCHAR(255) NOT NULL,
  test_code VARCHAR(50),
  category VARCHAR(100),
  price DECIMAL(10,2),
  tat_hours INT DEFAULT 24,
  sample_type VARCHAR(100),
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_test_code (test_code),
  INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create items table (for inventory/consumables)
CREATE TABLE IF NOT EXISTS items (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  item_name VARCHAR(255) NOT NULL,
  item_code VARCHAR(50),
  category VARCHAR(100),
  unit VARCHAR(50),
  price DECIMAL(10,2),
  stock_quantity INT DEFAULT 0,
  min_stock_level INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Show created tables
SELECT 'Database setup complete!' as Status;
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_SCHEMA = 'laboratory' 
AND TABLE_NAME IN ('patients', 'users', 'tests', 'items')
ORDER BY TABLE_NAME;
