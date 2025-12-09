@echo off
echo.
echo ========================================
echo   REMOVE REFERRED_BY FROM INVOICES
echo ========================================
echo.
echo This will remove referred_by column from invoices table.
echo We'll get this data from patients table instead.
echo.
pause

mysql -u root -p laboratory_db < remove-invoice-referred-by.sql

echo.
echo ========================================
echo   DONE!
echo ========================================
echo.
pause
