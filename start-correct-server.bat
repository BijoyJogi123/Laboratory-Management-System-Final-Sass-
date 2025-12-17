@echo off
echo 🔧 STARTING CORRECT SERVER WITH SETTINGS ROUTES
echo.

echo Stopping any running servers...
taskkill /f /im node.exe 2>nul
timeout /t 2 >nul

echo Going to backend directory...
cd backend

echo.
echo ⚠️  IMPORTANT: Starting server.js (NOT working-server.js)
echo.
echo 📝 server.js includes:
echo    - All existing routes
echo    - Settings routes for logo upload
echo    - POST /api/settings/upload-logo
echo    - GET /api/settings/lab-info
echo.

echo 🚀 Starting backend server...
echo.
node server.js