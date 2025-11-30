@echo off
echo.
echo ========================================
echo   TEST AUTO-STATUS UPDATE
echo ========================================
echo.
echo This will:
echo 1. Show current EMI plans and their status
echo 2. Check if auto-update logic is working
echo.
pause

node test-emi-auto-status.js

echo.
echo ========================================
echo   CHECK COMPLETE!
echo ========================================
echo.
echo Now test by:
echo 1. Start backend: start-backend.bat
echo 2. Go to EMI Management page
echo 3. Pay the last installment of any EMI
echo 4. Watch the console logs
echo 5. Refresh page - status should auto-update!
echo.
pause
