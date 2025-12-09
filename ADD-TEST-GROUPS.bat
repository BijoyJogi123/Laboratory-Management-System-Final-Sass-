@echo off
echo.
echo ========================================
echo   ADD TEST GROUPS FEATURE
echo ========================================
echo.
echo This will add:
echo - test_type column (single/group)
echo - parent_test_id for sub-tests
echo.
pause

mysql -u root -p laboratory_db < add-test-groups.sql

echo.
echo ========================================
echo   DONE!
echo ========================================
echo.
pause
