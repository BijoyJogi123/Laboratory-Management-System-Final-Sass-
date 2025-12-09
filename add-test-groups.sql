-- Add test_type column to distinguish between single and group tests
ALTER TABLE lab_test_master 
ADD COLUMN test_type ENUM('single', 'group') DEFAULT 'single' AFTER test_price;

-- Add parent_test_id to create sub-tests under a group
ALTER TABLE lab_test_master 
ADD COLUMN parent_test_id INT DEFAULT NULL AFTER test_type,
ADD FOREIGN KEY (parent_test_id) REFERENCES lab_test_master(test_id) ON DELETE CASCADE;

-- Add index for better performance
CREATE INDEX idx_parent_test ON lab_test_master(parent_test_id);
CREATE INDEX idx_test_type ON lab_test_master(test_type);
