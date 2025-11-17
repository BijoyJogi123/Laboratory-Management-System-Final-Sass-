@echo off
echo ========================================
echo Laboratory Management System - Test Suite
echo ========================================
echo.

echo Checking if server is running...
curl -s http://localhost:5000/api/health >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Server is not running!
    echo Please start the server first:
    echo   cd backend
    echo   node server-upgraded.js
    echo.
    pause
    exit /b 1
)

echo Server is running!
echo.
echo Running automated tests...
echo.

node test-new-features.js

echo.
echo ========================================
echo Test suite completed!
echo ========================================
pause
