@echo off
cls
echo ========================================
echo Laboratory Management System v2.0
echo Starting in NO-DB Mode
echo ========================================
echo.
echo This mode works WITHOUT database setup!
echo Your existing features work perfectly.
echo.
echo Starting server...
echo.

cd backend
node server-v2-no-db.js

pause
