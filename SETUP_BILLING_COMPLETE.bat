@echo off
echo ========================================
echo COMPLETE BILLING SETUP
echo ========================================
echo.

echo Step 1: Creating default tenant...
node create-default-tenant.js

echo.
echo Step 2: Testing billing endpoints...
node test-billing-endpoints.js

echo.
echo ========================================
echo SETUP COMPLETE
echo ========================================
echo.
echo Now:
echo 1. Make sure backend is restarted
echo 2. Try creating an invoice
echo 3. Check backend console for detailed logs
echo.

pause
