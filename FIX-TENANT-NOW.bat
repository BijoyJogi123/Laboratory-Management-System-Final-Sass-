@echo off
echo Creating tenant in database...
mysql -h 127.0.0.1 -u root -pCyberdumb#123 -e "USE laboratory; INSERT INTO tenants (tenant_id, tenant_name, tenant_code, contact_person, email, phone, address, city, state, country, status) VALUES (1, 'Default Laboratory', 'LAB', 'Admin', 'admin@lab.com', '1234567890', 'Lab Address', 'City', 'State', 'India', 'active') ON DUPLICATE KEY UPDATE tenant_name = 'Default Laboratory'; SELECT * FROM tenants WHERE tenant_id = 1;"
echo.
echo Tenant created! Now restart your backend.
pause
