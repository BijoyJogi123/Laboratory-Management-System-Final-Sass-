@echo off
echo ========================================
echo FIXING BILLING - Creating Default Tenant
echo ========================================
echo.

echo Step 1: Creating default tenant...
node create-default-tenant.js

if %errorlevel% == 0 (
    echo.
    echo ========================================
    echo SUCCESS! Billing is ready
    echo ========================================
    echo.
    echo Next steps:
    echo 1. Restart your backend server
    echo 2. Try creating an invoice again
    echo.
    echo Backend changes made:
    echo - Added billing routes to server.js
    echo - Created default tenant (ID: 1)
    echo.
) else (
    echo.
    echo ========================================
    echo ERROR! Failed to setup
    echo ========================================
    echo.
)

pause
