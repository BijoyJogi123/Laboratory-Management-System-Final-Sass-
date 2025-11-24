# Fix Database - Create Missing Tables

## Problem
The `patients` table doesn't exist in the database, causing errors when trying to create patients.

## Solution

### Option 1: Using MySQL Command Line (RECOMMENDED)

1. Open Command Prompt or PowerShell
2. Run this command:

```bash
mysql -h 127.0.0.1 -u root -pCyberdumb#123 laboratory < SETUP_DATABASE_NOW.sql
```

### Option 2: Using MySQL Workbench or phpMyAdmin

1. Open MySQL Workbench or phpMyAdmin
2. Select the `laboratory` database
3. Open the file `SETUP_DATABASE_NOW.sql`
4. Execute the SQL script

### Option 3: Manual SQL Execution

Copy and paste this SQL into your MySQL client:

```sql
USE laboratory;

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
```

## Verify Setup

After running the SQL, verify the table was created:

```sql
USE laboratory;
SHOW TABLES LIKE 'patients';
DESCRIBE patients;
```

## Then Restart Your Backend

```bash
cd backend
npm start
```

## Test Login

- Email: test@lab.com
- Password: Test@123

Now you should be able to create patients without errors!
