@echo off
cls
echo ========================================
echo Laboratory Management System v2.0
echo Starting Upgraded System...
echo ========================================
echo.

echo Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo Node.js: OK
echo.

echo Checking MySQL connection...
mysql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo WARNING: MySQL command not found in PATH
    echo Make sure MySQL is running
)
echo.

echo Starting backend server...
cd backend
start "LMS Backend v2.0" cmd /k "node server-upgraded.js"
echo Backend server started in new window
echo.

timeout /t 3 /nobreak >nul

echo Checking if server is running...
timeout /t 2 /nobreak >nul
curl -s http://localhost:5000/api/health >nul 2>&1
if %errorlevel% equ 0 (
    echo Server is running successfully!
    echo.
    echo ========================================
    echo System is ready!
    echo ========================================
    echo.
    echo Backend: http://localhost:5000
    echo Health Check: http://localhost:5000/api/health
    echo.
    echo Test Credentials:
    echo   Email: test@lab.com
    echo   Password: Test@123
    echo.
    echo To test the system, run:
    echo   node test-new-features.js
    echo.
    echo To view API documentation:
    echo   Open API_DOCUMENTATION.md
    echo.
) else (
    echo Waiting for server to start...
    timeout /t 3 /nobreak >nul
    curl -s http://localhost:5000/api/health >nul 2>&1
    if %errorlevel% equ 0 (
        echo Server is now running!
    ) else (
        echo WARNING: Server may not have started correctly
        echo Check the backend window for errors
    )
)

echo.
echo Press any key to open test menu...
pause >nul

:menu
cls
echo ========================================
echo Laboratory Management System v2.0
echo Test Menu
echo ========================================
echo.
echo 1. Run automated tests
echo 2. Open API documentation
echo 3. Open quick start guide
echo 4. Check server health
echo 5. Exit
echo.
set /p choice="Enter your choice (1-5): "

if "%choice%"=="1" (
    echo.
    echo Running automated tests...
    cd ..
    node test-new-features.js
    echo.
    pause
    goto menu
)

if "%choice%"=="2" (
    echo.
    echo Opening API documentation...
    start API_DOCUMENTATION.md
    goto menu
)

if "%choice%"=="3" (
    echo.
    echo Opening quick start guide...
    start QUICK_START.md
    goto menu
)

if "%choice%"=="4" (
    echo.
    echo Checking server health...
    curl http://localhost:5000/api/health
    echo.
    pause
    goto menu
)

if "%choice%"=="5" (
    echo.
    echo Goodbye!
    exit /b 0
)

echo Invalid choice. Please try again.
timeout /t 2 /nobreak >nul
goto menu
