@echo off
echo ========================================
echo FIXING DATABASE - Creating Missing Tables
echo ========================================
echo.

echo Running SQL script...
mysql -h 127.0.0.1 -u root -pCyberdumb#123 laboratory < SETUP_DATABASE_NOW.sql

if %errorlevel% == 0 (
    echo.
    echo ========================================
    echo SUCCESS! Database tables created
    echo ========================================
    echo.
    echo You can now:
    echo 1. Start backend: cd backend ^&^& npm start
    echo 2. Login with: test@lab.com / Test@123
    echo 3. Create patients and manage data
    echo.
) else (
    echo.
    echo ========================================
    echo ERROR! Failed to create tables
    echo ========================================
    echo.
    echo Please check:
    echo 1. MySQL is running
    echo 2. Password is correct: Cyberdumb#123
    echo 3. Database 'laboratory' exists
    echo.
)

pause
