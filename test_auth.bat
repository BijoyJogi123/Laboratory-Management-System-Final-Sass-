@echo off
echo ============================================
echo Testing Authentication System
echo ============================================
echo.

echo [TEST 1] Login with correct credentials
echo ----------------------------------------
curl -X POST http://localhost:5000/api/auth/login-user -H "Content-Type: application/json" -d "{\"email\":\"test@lab.com\",\"password\":\"Test@123\"}" 2>nul
echo.
echo.

echo [TEST 2] Login with wrong password
echo ----------------------------------------
curl -X POST http://localhost:5000/api/auth/login-user -H "Content-Type: application/json" -d "{\"email\":\"test@lab.com\",\"password\":\"WrongPassword\"}" 2>nul
echo.
echo.

echo [TEST 3] Accessing protected endpoint WITHOUT token
echo ----------------------------------------
curl -X GET http://localhost:5000/api/tests/all-tests 2>nul
echo.
echo.

echo [TEST 4] Accessing protected endpoint WITH valid token
echo ----------------------------------------
echo Getting fresh token...
for /f "tokens=2 delims=:}" %%a in ('curl -s -X POST http://localhost:5000/api/auth/login-user -H "Content-Type: application/json" -d "{\"email\":\"test@lab.com\",\"password\":\"Test@123\"}"') do set TOKEN=%%a
set TOKEN=%TOKEN:"=%
curl -X GET http://localhost:5000/api/tests/all-tests -H "Authorization: Bearer %TOKEN%" 2>nul
echo.
echo.

echo ============================================
echo Tests Complete!
echo ============================================
pause
