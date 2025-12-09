@echo off
echo.
echo ========================================
echo   ADD REFERRED BY COLUMN
echo ========================================
echo.
echo This will add 'referred_by' column to:
echo - patients table
echo - invoices table
echo.
pause

mysql -u root -p laboratory_db < add-referred-by-column.sql

echo.
echo ========================================
echo   DONE!
echo ========================================
echo.
echo Column 'referred_by' added successfully!
echo.
pause
