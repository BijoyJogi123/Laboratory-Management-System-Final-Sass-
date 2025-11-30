# 🗄️ Database Setup Guide

## Prerequisites
- MySQL Server installed (5.7 or higher recommended)
- Node.js installed (14.x or higher)

## Step 1: Create MySQL Database

1. **Login to MySQL:**
```bash
mysql -u root -p
```

2. **Create the database:**
```sql
CREATE DATABASE laboratory;
USE laboratory;
```

3. **Import the database schema:**

If you have a SQL file with the schema:
```bash
mysql -u root -p laboratory < DATABASE_SCHEMA_UPGRADE.sql
```

Or manually create the tables using the schema in `DATABASE_SCHEMA_UPGRADE.sql`

## Step 2: Configure Backend Environment

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Create `.env` file from example:**
```bash
cp .env.example .env
```

3. **Edit `.env` file with your database credentials:**
```env
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=laboratory
```

## Step 3: Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd laboratory
npm install
```

## Step 4: Start the Application

**Terminal 1 - Start Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Start Frontend:**
```bash
cd laboratory
npm start
```

## Step 5: Login

Open browser to `http://localhost:3000` and login with:
- **Email:** test@lab.com
- **Password:** Test@123

## Database Tables

The application uses these main tables:
- `lab_sales` - Patient records
- `lab_sales_items` - Patient test items
- `lab_test_master` - Test definitions
- `lab_items` - Test items/parameters
- `test_reports` - Test results
- `invoices` - Billing invoices
- `emi_plans` - EMI payment plans
- `party_ledger` - Financial ledger
- `packages` - Test packages
- `doctors` - Referring doctors
- `test_orders` - Test order tracking

## Troubleshooting

### Database Connection Failed
- Check MySQL is running: `sudo systemctl status mysql`
- Verify credentials in `.env` file
- Ensure database `laboratory` exists

### Port Already in Use
- Backend (5000): Kill existing process or change PORT in `.env`
- Frontend (3000): Stop other React apps or modify package.json

### Table Does Not Exist
- Import the database schema from `DATABASE_SCHEMA_UPGRADE.sql`
- Check MySQL user has proper permissions

## Features Now Working with Database

✅ **Patient Management** - Add, view, update, delete patients (real data)
✅ **Test Management** - Create tests and items (saved to database)
✅ **Report Entry** - Submit and retrieve test reports (persistent storage)
✅ **Billing System** - Create invoices, track payments (database-backed)
✅ **EMI Management** - Create payment plans, track installments
✅ **Ledger System** - Track party transactions
✅ **Package Management** - Create and manage test packages
✅ **Doctor Management** - Manage referring doctors
✅ **Test Orders** - Track test order status

All data is now **persisted in MySQL database** instead of being hardcoded!
