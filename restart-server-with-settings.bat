@echo off
echo Stopping any running servers...
taskkill /f /im node.exe 2>nul

echo Starting backend server with settings routes...
cd backend
echo Using server.js (which includes settings routes)
start "Backend Server" cmd /k "node server.js"

echo.
echo ✅ Server started with settings routes!
echo.
echo 📝 The server should now support:
echo    - POST /api/settings/upload-logo
echo    - GET /api/settings/lab-info
echo    - PUT /api/settings/lab-info
echo    - DELETE /api/settings/remove-logo
echo.
echo 🌐 Backend running on: http://localhost:5000
echo.
pause