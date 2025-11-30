USE laboratory;

-- Show current status before fix
SELECT 'BEFORE FIX - EMI Plans with all paid installments but still active:' as info;
SELECT 
  ep.emi_plan_id,
  ep.status as emi_status,
  i.invoice_number,
  i.payment_status,
  i.patient_name,
  COUNT(ei.installment_id) as total_installments,
  SUM(CASE WHEN ei.status = 'paid' THEN 1 ELSE 0 END) as paid_installments
FROM emi_plans ep
JOIN invoices i ON ep.invoice_id = i.invoice_id
LEFT JOIN emi_installments ei ON ep.emi_plan_id = ei.emi_plan_id
WHERE ep.status = 'active'
GROUP BY ep.emi_plan_id
HAVING total_installments = paid_installments;

-- Fix EMI plans where all installments are paid
UPDATE emi_plans ep
SET ep.status = 'completed'
WHERE ep.status = 'active'
AND ep.emi_plan_id IN (
  SELECT emi_plan_id FROM (
    SELECT ep2.emi_plan_id
    FROM emi_plans ep2
    LEFT JOIN emi_installments ei ON ep2.emi_plan_id = ei.emi_plan_id
    WHERE ep2.status = 'active'
    GROUP BY ep2.emi_plan_id
    HAVING COUNT(ei.installment_id) = SUM(CASE WHEN ei.status = 'paid' THEN 1 ELSE 0 END)
    AND COUNT(ei.installment_id) > 0
  ) as completed_emis
);

-- Fix invoices for completed EMI plans
UPDATE invoices i
JOIN emi_plans ep ON i.invoice_id = ep.invoice_id
SET 
  i.payment_status = 'paid',
  i.paid_amount = i.total_amount,
  i.balance_amount = 0
WHERE ep.status = 'completed' 
AND i.payment_status != 'paid';

-- Show results after fix
SELECT 'AFTER FIX - Updated EMI Plans:' as info;
SELECT 
  ep.emi_plan_id,
  ep.status as emi_status,
  i.invoice_number,
  i.payment_status,
  i.patient_name,
  COUNT(ei.installment_id) as total_installments,
  SUM(CASE WHEN ei.status = 'paid' THEN 1 ELSE 0 END) as paid_installments
FROM emi_plans ep
JOIN invoices i ON ep.invoice_id = i.invoice_id
LEFT JOIN emi_installments ei ON ep.emi_plan_id = ei.emi_plan_id
WHERE ep.status = 'completed'
GROUP BY ep.emi_plan_id;