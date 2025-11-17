@echo off
echo ========================================
echo QUICK DIAGNOSTIC TEST
echo ========================================
echo.

echo Testing if backend is running...
curl -s http://localhost:5000/api/health
if %errorlevel% neq 0 (
    echo.
    echo ❌ BACKEND IS NOT RUNNING!
    echo.
    echo Please start backend first:
    echo   cd backend
    echo   node complete-server.js
    echo.
    pause
    exit /b 1
)

echo.
echo ✅ Backend is running!
echo.
echo Testing login...
curl -s -X POST http://localhost:5000/api/auth/login-user -H "Content-Type: application/json" -d "{\"email\":\"admin\",\"password\":\"admin123\"}"

echo.
echo.
echo ========================================
echo If you see a token above, backend works!
echo ========================================
echo.
echo Now check browser console (F12) when clicking Add Patient
echo.
pause
