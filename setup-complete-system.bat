@echo off
cls
echo ========================================
echo Laboratory Management System v2.0
echo Complete Setup Script
echo ========================================
echo.

echo Step 1: Verifying Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
node --version
echo.

echo Step 2: Verifying MySQL...
mysql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo WARNING: MySQL command not found in PATH
    echo Make sure MySQL is installed and running
    echo.
) else (
    mysql --version
    echo.
)

echo Step 3: Checking database setup...
node verify-setup.js
if %errorlevel% neq 0 (
    echo.
    echo ========================================
    echo Database Setup Required
    echo ========================================
    echo.
    echo The database schema needs to be installed.
    echo.
    set /p install="Do you want to install it now? (y/n): "
    if /i "%install%"=="y" (
        echo.
        echo Installing database schema...
        echo Please enter your MySQL root password when prompted.
        echo.
        mysql -u root -p laboratory < DATABASE_SCHEMA_UPGRADE.sql
        if %errorlevel% equ 0 (
            echo.
            echo ✅ Database schema installed successfully!
            echo.
            echo Verifying installation...
            node verify-setup.js
        ) else (
            echo.
            echo ❌ Database installation failed!
            echo Please check your MySQL credentials and try again.
            pause
            exit /b 1
        )
    ) else (
        echo.
        echo Please install the database schema manually:
        echo   mysql -u root -p laboratory ^< DATABASE_SCHEMA_UPGRADE.sql
        echo.
        pause
        exit /b 1
    )
)

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Your system is ready to use!
echo.
set /p start="Do you want to start the server now? (y/n): "
if /i "%start%"=="y" (
    echo.
    echo Starting server...
    start-upgraded-system.bat
) else (
    echo.
    echo To start the server later, run:
    echo   start-upgraded-system.bat
    echo.
    echo Or manually:
    echo   cd backend
    echo   node server-upgraded.js
    echo.
    pause
)
