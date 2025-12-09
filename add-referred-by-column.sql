-- Add 'referred_by' column to patients table
ALTER TABLE patients 
ADD COLUMN referred_by VARCHAR(255) DEFAULT NULL AFTER address;

-- Add 'referred_by' column to invoices table
ALTER TABLE invoices 
ADD COLUMN referred_by VARCHAR(255) DEFAULT NULL AFTER patient_address;

-- Update existing records (optional - set to NULL or empty string)
UPDATE patients SET referred_by = NULL WHERE referred_by IS NULL;
UPDATE invoices SET referred_by = NULL WHERE referred_by IS NULL;
