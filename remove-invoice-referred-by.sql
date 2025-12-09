-- Remove 'referred_by' column from invoices table
-- We'll get this data from patients table via JOIN instead

ALTER TABLE invoices DROP COLUMN IF EXISTS referred_by;
