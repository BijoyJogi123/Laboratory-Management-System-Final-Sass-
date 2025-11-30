@echo off
echo ========================================
echo FIXING COMPLETED EMI INVOICES
echo ========================================
echo.

echo Updating completed EMI invoices to PAID status...
node fix-completed-emi-invoices.js

echo.
echo ========================================
echo DONE!
echo ========================================
echo.
echo Now:
echo 1. Refresh your billing page
echo 2. All completed EMIs should show as PAID
echo.

pause