@echo off
echo ========================================
echo FIXING EMI STATUS - URGENT FIX
echo ========================================
echo.

echo Running SQL fix for EMI status...
mysql -h 127.0.0.1 -u root -pCyberdumb#123 laboratory -e "source fix-emi-status-now.sql"

echo.
echo ========================================
echo DONE!
echo ========================================
echo.
echo Now:
echo 1. Refresh EMI Management page
echo 2. Refresh Billing page  
echo 3. All should show correct status
echo.

pause