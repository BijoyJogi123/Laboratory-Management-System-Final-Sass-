@echo off
echo ========================================
echo FIXING EMI STATUS - IMMEDIATE FIX
echo ========================================
echo.

cd backend
node fix-emi-status.js
cd ..

echo.
echo ========================================
echo DONE! 
echo ========================================
echo.
echo Now refresh your pages:
echo 1. EMI Management - should show "completed"
echo 2. Billing - should show "paid"
echo.

pause