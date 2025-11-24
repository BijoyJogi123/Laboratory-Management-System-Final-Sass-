@echo off
echo ========================================
echo FIXING TESTS FEATURE
echo ========================================
echo.

echo Step 1: Creating tests table...
node create-tests-table.js

if %errorlevel% == 0 (
    echo.
    echo ========================================
    echo SUCCESS! Tests table ready
    echo ========================================
    echo.
    echo Next steps:
    echo 1. Restart your backend server
    echo 2. Go to Tests page in frontend
    echo 3. Try adding a test
    echo.
    echo Backend changes made:
    echo - Added test routes to server.js
    echo - Updated controller to accept frontend fields
    echo - Updated model to use tests table
    echo.
) else (
    echo.
    echo ========================================
    echo ERROR! Failed to create table
    echo ========================================
    echo.
    echo Please check:
    echo 1. MySQL is running
    echo 2. Database 'laboratory' exists
    echo 3. Credentials in backend/.env are correct
    echo.
)

pause
