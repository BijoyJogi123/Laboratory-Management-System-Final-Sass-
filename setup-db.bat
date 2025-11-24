@echo off
echo Creating patients table...
mysql -h 127.0.0.1 -u root -pCyberdumb#123 laboratory < create-patients-table.sql
if %errorlevel% == 0 (
    echo Success! Patients table created.
) else (
    echo Failed to create table. Check MySQL connection.
)
pause
