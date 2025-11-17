@echo off
echo ========================================
echo VERIFYING FRONTEND SETUP
echo ========================================
echo.

echo Checking if new pages exist...
echo.

if exist "laboratory\src\pages\inventory\InventoryList.js" (
    echo [OK] Inventory Page exists
) else (
    echo [ERROR] Inventory Page missing
)

if exist "laboratory\src\pages\ledger\PartyLedger.js" (
    echo [OK] Ledger Page exists
) else (
    echo [ERROR] Ledger Page missing
)

if exist "laboratory\src\pages\doctors\DoctorList.js" (
    echo [OK] Doctors Page exists
) else (
    echo [ERROR] Doctors Page missing
)

if exist "laboratory\src\pages\packages\PackageList.js" (
    echo [OK] Packages Page exists
) else (
    echo [ERROR] Packages Page missing
)

if exist "laboratory\src\pages\reports\ReportsList.js" (
    echo [OK] Reports Page exists
) else (
    echo [ERROR] Reports Page missing
)

if exist "laboratory\src\pages\settings\Settings.js" (
    echo [OK] Settings Page exists
) else (
    echo [ERROR] Settings Page missing
)

echo.
echo Checking AppNew.js...
if exist "laboratory\src\AppNew.js" (
    echo [OK] AppNew.js exists
) else (
    echo [ERROR] AppNew.js missing
)

echo.
echo Checking index.js configuration...
findstr /C:"AppNew" laboratory\src\index.js >nul
if %errorlevel% equ 0 (
    echo [OK] index.js is using AppNew
) else (
    echo [ERROR] index.js is NOT using AppNew
)

echo.
echo ========================================
echo VERIFICATION COMPLETE
echo ========================================
echo.
echo To start the frontend:
echo   cd laboratory
echo   npm start
echo.
pause
