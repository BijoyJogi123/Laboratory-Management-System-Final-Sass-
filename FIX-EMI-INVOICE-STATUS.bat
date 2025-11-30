@echo off
echo.
echo ========================================
echo   FIX EMI AND INVOICE STATUS
echo ========================================
echo.
echo This will update:
echo - EMI plans to "completed" when all installments are paid
echo - Invoices to "paid" when all EMI installments are paid
echo.
pause

node fix-completed-emi-invoices-now.js

echo.
echo ========================================
echo   DONE!
echo ========================================
echo.
pause
