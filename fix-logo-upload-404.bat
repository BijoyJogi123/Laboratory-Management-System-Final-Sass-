@echo off
echo 🔧 FIXING LOGO UPLOAD 404 ERROR
echo.

echo Step 1: Stopping any running servers...
taskkill /f /im node.exe 2>nul
timeout /t 2 >nul

echo Step 2: Going to backend directory...
cd backend

echo Step 3: Checking if settings routes exist...
if exist "routes\settingsRoutes.js" (
    echo ✅ settingsRoutes.js found
) else (
    echo ❌ settingsRoutes.js missing - this is the problem!
    pause
    exit
)

echo Step 4: Starting server with settings routes...
echo 📝 Using server.js (NOT working-server.js)
echo.
echo 🚀 Starting backend server...
node server.js

pause