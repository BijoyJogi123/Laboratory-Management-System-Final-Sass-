-- Drop existing table if it exists
DROP TABLE IF EXISTS `invoice_settings`;

-- Create invoice_settings table for tenant-specific invoice customization (without foreign key)
CREATE TABLE `invoice_settings` (
  `setting_id` int NOT NULL AUTO_INCREMENT,
  `tenant_id` int NOT NULL DEFAULT 1,
  `lab_name` varchar(255) NOT NULL,
  `logo_url` varchar(500) DEFAULT NULL,
  `address` text,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `tax_id` varchar(50) DEFAULT NULL,
  `terms_conditions` text,
  `header_color` varchar(7) DEFAULT '#2563eb',
  `show_logo` tinyint(1) DEFAULT '1',
  `invoice_prefix` varchar(10) DEFAULT 'INV',
  `footer_text` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`setting_id`),
  UNIQUE KEY `unique_tenant_settings` (`tenant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Insert default settings for tenant_id = 1
INSERT INTO `invoice_settings` (
  `tenant_id`, 
  `lab_name`, 
  `address`, 
  `phone`, 
  `email`,
  `terms_conditions`
) VALUES (
  1,
  'Laboratory Management System',
  '123 Medical Street, City, State - 123456',
  '+91 1234567890',
  'info@labsystem.com',
  'Thank you for your business. Please make payment by the due date.'
) ON DUPLICATE KEY UPDATE `tenant_id` = `tenant_id`;
