-- Additional MySQL initialization for Docker
-- This runs after the schema is imported

USE laboratory;

-- Grant privileges to labuser
GRANT ALL PRIVILEGES ON laboratory.* TO 'labuser'@'%';
FLUSH PRIVILEGES;

-- Verify tables were created
SHOW TABLES;

-- Display startup message
SELECT 'Database initialized successfully!' as Status;
SELECT COUNT(*) as TableCount FROM information_schema.tables WHERE table_schema = 'laboratory';
