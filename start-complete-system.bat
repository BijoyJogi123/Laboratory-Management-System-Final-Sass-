@echo off
echo ========================================
echo STARTING COMPLETE LABORATORY SYSTEM
echo ========================================
echo.

echo Starting Backend Server...
start "Backend Server" cmd /k "cd backend && node complete-server.js"

timeout /t 3 /nobreak >nul

echo Starting Frontend...
start "Frontend" cmd /k "cd laboratory && npm start"

echo.
echo ========================================
echo SYSTEM STARTING...
echo ========================================
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Login Credentials:
echo   Username: admin
echo   Password: admin123
echo.
echo Press any key to close this window...
pause >nul
