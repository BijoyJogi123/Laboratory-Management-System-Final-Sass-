const db = require('../config/db.config');

const EMIModel = {
  // Create EMI Plan
  createEMIPlan: async (emiData) => {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Create EMI plan
      const [result] = await connection.query(
        `INSERT INTO emi_plans (
          tenant_id, invoice_id, total_amount, down_payment,
          emi_amount, number_of_installments, frequency,
          interest_rate, interest_amount, start_date, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          emiData.tenant_id,
          emiData.invoice_id,
          emiData.total_amount,
          emiData.down_payment || 0,
          emiData.emi_amount,
          emiData.number_of_installments,
          emiData.frequency,
          emiData.interest_rate || 0,
          emiData.interest_amount || 0,
          emiData.start_date,
          'active'
        ]
      );

      const emiPlanId = result.insertId;

      // Generate installments
      const installments = EMIModel.generateInstallments(
        emiData.number_of_installments,
        emiData.emi_amount,
        emiData.start_date,
        emiData.frequency
      );

      for (let i = 0; i < installments.length; i++) {
        await connection.query(
          `INSERT INTO emi_installments (
            emi_plan_id, installment_number, due_date, amount, status
          ) VALUES (?, ?, ?, ?, ?)`,
          [
            emiPlanId,
            i + 1,
            installments[i].due_date,
            installments[i].amount,
            'pending'
          ]
        );
      }

      // Update invoice payment type
      await connection.query(
        `UPDATE invoices SET payment_type = 'emi' WHERE invoice_id = ?`,
        [emiData.invoice_id]
      );

      await connection.commit();
      return { emiPlanId, success: true };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  // Generate Installment Schedule
  generateInstallments: (numberOfInstallments, emiAmount, startDate, frequency) => {
    const installments = [];
    let currentDate = new Date(startDate);

    for (let i = 0; i < numberOfInstallments; i++) {
      installments.push({
        due_date: new Date(currentDate),
        amount: emiAmount
      });

      // Calculate next due date based on frequency
      switch (frequency) {
        case 'daily':
          currentDate.setDate(currentDate.getDate() + 1);
          break;
        case 'weekly':
          currentDate.setDate(currentDate.getDate() + 7);
          break;
        case 'monthly':
          currentDate.setMonth(currentDate.getMonth() + 1);
          break;
        default:
          currentDate.setMonth(currentDate.getMonth() + 1);
      }
    }

    return installments;
  },

  // Calculate EMI
  calculateEMI: (principal, interestRate, tenure) => {
    if (interestRate === 0) {
      return principal / tenure;
    }

    const monthlyRate = interestRate / 12 / 100;
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) /
      (Math.pow(1 + monthlyRate, tenure) - 1);

    return Math.round(emi * 100) / 100;
  },

  // Get EMI Plan by ID
  getEMIPlanById: async (emiPlanId, tenantId) => {
    const [plans] = await db.query(
      `SELECT ep.*, i.invoice_number, 
        COALESCE(p.patient_name, i.patient_name, 'Unknown') as patient_name
       FROM emi_plans ep
       JOIN invoices i ON ep.invoice_id = i.invoice_id
       LEFT JOIN patients p ON i.patient_id = p.id
       WHERE ep.emi_plan_id = ? AND ep.tenant_id = ?`,
      [emiPlanId, tenantId]
    );

    if (plans.length === 0) return null;

    const plan = plans[0];

    // Get installments
    const [installments] = await db.query(
      `SELECT * FROM emi_installments 
       WHERE emi_plan_id = ? 
       ORDER BY installment_number`,
      [emiPlanId]
    );

    plan.installments = installments;
    return plan;
  },

  // Get Installment by ID
  getInstallmentById: async (installmentId, tenantId) => {
    const [installments] = await db.query(
      `SELECT ei.*, ep.invoice_id, i.invoice_number, 
        COALESCE(p.patient_name, i.patient_name, 'Unknown') as patient_name,
        i.patient_contact, i.patient_email, i.patient_address
       FROM emi_installments ei
       JOIN emi_plans ep ON ei.emi_plan_id = ep.emi_plan_id
       JOIN invoices i ON ep.invoice_id = i.invoice_id
       LEFT JOIN patients p ON i.patient_id = p.id
       WHERE ei.installment_id = ? AND ep.tenant_id = ?`,
      [installmentId, tenantId]
    );

    return installments[0];
  },

  // Get All EMI Plans
  getAllEMIPlans: async (tenantId, filters = {}) => {
    let query = `
      SELECT ep.*, i.invoice_number, 
        COALESCE(p.patient_name, i.patient_name, 'Unknown') as patient_name,
        COUNT(ei.installment_id) as total_installments,
        SUM(CASE WHEN ei.status = 'paid' THEN 1 ELSE 0 END) as paid_installments,
        SUM(CASE WHEN ei.status = 'pending' THEN 1 ELSE 0 END) as pending_installments,
        SUM(CASE WHEN ei.status = 'overdue' THEN 1 ELSE 0 END) as overdue_installments
      FROM emi_plans ep
      JOIN invoices i ON ep.invoice_id = i.invoice_id
      LEFT JOIN patients p ON i.patient_id = p.id
      LEFT JOIN emi_installments ei ON ep.emi_plan_id = ei.emi_plan_id
      WHERE ep.tenant_id = ?
    `;
    const params = [tenantId];

    if (filters.status) {
      query += ` AND ep.status = ?`;
      params.push(filters.status);
    }

    query += ` GROUP BY ep.emi_plan_id ORDER BY ep.created_at DESC`;

    const [plans] = await db.query(query, params);
    
    // AUTO-FIX: Check each plan and update status if all installments are paid
    for (const plan of plans) {
      const totalInstallments = parseInt(plan.total_installments);
      const paidInstallments = parseInt(plan.paid_installments);
      
      // If all installments are paid but status is not completed
      if (totalInstallments > 0 && totalInstallments === paidInstallments) {
        if (plan.status !== 'completed') {
          console.log(`🔧 AUTO-FIX: EMI Plan ${plan.emi_plan_id} has ${paidInstallments}/${totalInstallments} paid - updating to completed`);
          
          await db.query(
            `UPDATE emi_plans SET status = 'completed' WHERE emi_plan_id = ?`,
            [plan.emi_plan_id]
          );
          
          await db.query(
            `UPDATE invoices SET 
              payment_status = 'paid',
              balance_amount = 0
             WHERE invoice_id = ?`,
            [plan.invoice_id]
          );
          
          // Update the plan object to reflect the change
          plan.status = 'completed';
          console.log(`✅ AUTO-FIX: Updated EMI ${plan.emi_plan_id} → completed, Invoice → paid`);
        }
      } else if (paidInstallments > 0 && paidInstallments < totalInstallments) {
        // Some installments paid - ensure invoice is partial
        const [invoice] = await db.query(
          `SELECT payment_status FROM invoices WHERE invoice_id = ?`,
          [plan.invoice_id]
        );
        
        if (invoice[0] && invoice[0].payment_status !== 'partial') {
          console.log(`🔧 AUTO-FIX: Invoice ${plan.invoice_id} has partial payments - updating status`);
          await db.query(
            `UPDATE invoices SET payment_status = 'partial' WHERE invoice_id = ?`,
            [plan.invoice_id]
          );
          console.log(`✅ AUTO-FIX: Updated Invoice → partial`);
        }
      }
    }
    
    return plans;
  },

  // Get Due Installments
  getDueInstallments: async (tenantId, daysAhead = 7) => {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + daysAhead);

    const [installments] = await db.query(
      `SELECT ei.*, ep.invoice_id, i.invoice_number, i.patient_name, i.patient_contact
       FROM emi_installments ei
       JOIN emi_plans ep ON ei.emi_plan_id = ep.emi_plan_id
       JOIN invoices i ON ep.invoice_id = i.invoice_id
       WHERE ep.tenant_id = ? 
         AND ei.status IN ('pending', 'partial')
         AND ei.due_date BETWEEN ? AND ?
       ORDER BY ei.due_date`,
      [tenantId, today, futureDate]
    );

    return installments;
  },

  // Get Overdue Installments
  getOverdueInstallments: async (tenantId) => {
    const today = new Date();

    const [installments] = await db.query(
      `SELECT ei.*, ep.invoice_id, i.invoice_number, i.patient_name, i.patient_contact
       FROM emi_installments ei
       JOIN emi_plans ep ON ei.emi_plan_id = ep.emi_plan_id
       JOIN invoices i ON ep.invoice_id = i.invoice_id
       WHERE ep.tenant_id = ? 
         AND ei.status = 'pending'
         AND ei.due_date < ?
       ORDER BY ei.due_date`,
      [tenantId, today]
    );

    // Mark as overdue
    if (installments.length > 0) {
      const installmentIds = installments.map(i => i.installment_id);
      await db.query(
        `UPDATE emi_installments SET status = 'overdue' WHERE installment_id IN (?)`,
        [installmentIds]
      );
    }

    return installments;
  },

  // Pay Installment
  payInstallment: async (installmentId, tenantId, paymentData) => {
    console.log(`\n🔄 EMIModel.payInstallment called`);
    console.log(`   Installment ID: ${installmentId}, Tenant ID: ${tenantId}`);

    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();
      console.log(`   ✓ Transaction started`);

      // Get installment details
      const [installments] = await connection.query(
        `SELECT ei.*, ep.invoice_id, ep.tenant_id
         FROM emi_installments ei
         JOIN emi_plans ep ON ei.emi_plan_id = ep.emi_plan_id
         WHERE ei.installment_id = ? AND ep.tenant_id = ?`,
        [installmentId, tenantId]
      );

      if (installments.length === 0) {
        throw new Error('Installment not found');
      }

      const installment = installments[0];
      const newPaidAmount = parseFloat(installment.paid_amount) + parseFloat(paymentData.amount);
      const remainingAmount = parseFloat(installment.amount) - newPaidAmount;

      let status = 'pending';
      if (remainingAmount <= 0) {
        status = 'paid';
      } else if (newPaidAmount > 0) {
        status = 'partial';
      }

      // Update installment
      console.log(`   💰 Updating installment ${installmentId} to status: ${status}`);
      await connection.query(
        `UPDATE emi_installments SET
          paid_amount = ?,
          payment_date = ?,
          status = ?,
          payment_mode = ?,
          transaction_id = ?,
          notes = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE installment_id = ?`,
        [
          newPaidAmount,
          paymentData.payment_date || new Date(),
          status,
          paymentData.payment_mode,
          paymentData.transaction_id,
          paymentData.notes,
          installmentId
        ]
      );
      console.log(`   ✅ Installment updated`);

      // Create payment transaction
      await connection.query(
        `INSERT INTO payment_transactions (
          tenant_id, emi_installment_id, transaction_number,
          transaction_date, amount, payment_mode, payment_reference,
          received_by, notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          tenantId,
          installmentId,
          paymentData.transaction_number,
          paymentData.payment_date || new Date(),
          paymentData.amount,
          paymentData.payment_mode,
          paymentData.payment_reference,
          paymentData.received_by,
          paymentData.notes
        ]
      );

      // Update invoice paid amount and balance
      const [currentInvoice] = await connection.query(
        `SELECT total_amount, paid_amount, balance_amount FROM invoices WHERE invoice_id = ?`,
        [installment.invoice_id]
      );

      const invoiceTotal = parseFloat(currentInvoice[0].total_amount);
      const invoicePaid = parseFloat(currentInvoice[0].paid_amount);
      const newInvoicePaid = invoicePaid + parseFloat(paymentData.amount);
      let newInvoiceBalance = invoiceTotal - newInvoicePaid;

      // Prevent negative balance
      if (newInvoiceBalance < 0) {
        newInvoiceBalance = 0;
      }

      await connection.query(
        `UPDATE invoices SET
          paid_amount = ?,
          balance_amount = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE invoice_id = ?`,
        [Math.min(newInvoicePaid, invoiceTotal), newInvoiceBalance, installment.invoice_id]
      );

      // Check if all installments are paid and update EMI + invoice status accordingly
      const [emiPlanId] = await connection.query(
        `SELECT emi_plan_id FROM emi_installments WHERE installment_id = ?`,
        [installmentId]
      );

      const [allInstallments] = await connection.query(
        `SELECT COUNT(*) as total, 
                SUM(CASE WHEN status = 'paid' THEN 1 ELSE 0 END) as paid
         FROM emi_installments 
         WHERE emi_plan_id = ?`,
        [emiPlanId[0].emi_plan_id]
      );

      const totalInstallments = allInstallments[0].total;
      const paidInstallments = allInstallments[0].paid;

      console.log(`\n📊 AUTO-STATUS CHECK:`);
      console.log(`   EMI Plan ID: ${emiPlanId[0].emi_plan_id}`);
      console.log(`   Invoice ID: ${installment.invoice_id}`);
      console.log(`   Installments Paid: ${paidInstallments}/${totalInstallments}`);

      if (parseInt(totalInstallments) === parseInt(paidInstallments) && parseInt(paidInstallments) > 0) {
        // All installments paid - mark EMI as completed and invoice as paid
        console.log(`\n🎉 ALL INSTALLMENTS PAID! Auto-updating statuses...`);
        
        await connection.query(
          `UPDATE emi_plans SET status = 'completed' WHERE emi_plan_id = ?`,
          [emiPlanId[0].emi_plan_id]
        );
        console.log(`   ✅ EMI Plan status → COMPLETED`);

        await connection.query(
          `UPDATE invoices SET 
            payment_status = 'paid',
            paid_amount = total_amount,
            balance_amount = 0
           WHERE invoice_id = ?`,
          [installment.invoice_id]
        );
        console.log(`   ✅ Invoice status → PAID`);
        console.log(`   ✅ Invoice balance → 0\n`);
        
      } else if (parseInt(paidInstallments) > 0) {
        // Some installments paid - mark as partial
        console.log(`\n⚠️  PARTIAL PAYMENT: ${paidInstallments} of ${totalInstallments} installments paid`);
        await connection.query(
          `UPDATE invoices SET payment_status = 'partial' WHERE invoice_id = ?`,
          [installment.invoice_id]
        );
        console.log(`   ✅ Invoice status → PARTIAL\n`);
      }

      await connection.commit();
      return { success: true, status, remainingAmount };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  // Update EMI Plan
  updateEMIPlan: async (emiPlanId, tenantId, updateData) => {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      console.log(`🔄 Updating EMI Plan ${emiPlanId} to status: ${updateData.status}`);

      // Update EMI plan details
      await connection.query(
        `UPDATE emi_plans SET 
          status = ?, 
          updated_at = CURRENT_TIMESTAMP
        WHERE emi_plan_id = ? AND tenant_id = ?`,
        [updateData.status, emiPlanId, tenantId]
      );

      // If EMI is marked as completed, update the corresponding invoice to paid
      if (updateData.status === 'completed') {
        console.log('✅ EMI marked as completed - updating invoice to PAID');
        
        // Get the invoice ID for this EMI plan
        const [emiPlan] = await connection.query(
          `SELECT invoice_id FROM emi_plans WHERE emi_plan_id = ? AND tenant_id = ?`,
          [emiPlanId, tenantId]
        );

        if (emiPlan.length > 0) {
          const invoiceId = emiPlan[0].invoice_id;
          
          // Update invoice status to paid and balance to 0
          await connection.query(
            `UPDATE invoices SET 
              payment_status = 'paid',
              balance_amount = 0,
              updated_at = CURRENT_TIMESTAMP
            WHERE invoice_id = ?`,
            [invoiceId]
          );
          
          console.log(`✅ Invoice ${invoiceId} updated to PAID status`);
        }
      }

      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  // Delete EMI Plan
  deleteEMIPlan: async (emiPlanId, tenantId) => {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Get invoice ID before deleting
      const [plans] = await connection.query(
        `SELECT invoice_id FROM emi_plans WHERE emi_plan_id = ? AND tenant_id = ?`,
        [emiPlanId, tenantId]
      );

      if (plans.length === 0) return false;
      const invoiceId = plans[0].invoice_id;

      // Delete installments first (foreign key constraint)
      await connection.query(
        `DELETE FROM emi_installments WHERE emi_plan_id = ?`,
        [emiPlanId]
      );

      // Delete EMI plan
      const [result] = await connection.query(
        `DELETE FROM emi_plans WHERE emi_plan_id = ? AND tenant_id = ?`,
        [emiPlanId, tenantId]
      );

      // Revert invoice payment type if no other active EMI plans exist for this invoice
      // (Simplification: just set it back to 'full' or check if other plans exist)
      // For now, let's just leave it or set to 'full' if we assume 1 plan per invoice
      await connection.query(
        `UPDATE invoices SET payment_type = 'full' WHERE invoice_id = ?`,
        [invoiceId]
      );

      await connection.commit();
      return result.affectedRows > 0;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  getEMIStats: async (tenantId) => {
    const [stats] = await db.query(
      `SELECT 
        COUNT(DISTINCT ep.emi_plan_id) as total_plans,
        COUNT(ei.installment_id) as total_installments,
        SUM(CASE WHEN ei.status = 'paid' THEN 1 ELSE 0 END) as paid_installments,
        SUM(CASE WHEN ei.status = 'pending' THEN 1 ELSE 0 END) as pending_installments,
        SUM(CASE WHEN ei.status = 'overdue' THEN 1 ELSE 0 END) as overdue_installments,
        SUM(ei.amount) as total_amount,
        SUM(ei.paid_amount) as total_paid
      FROM emi_plans ep
      LEFT JOIN emi_installments ei ON ep.emi_plan_id = ei.emi_plan_id
      WHERE ep.tenant_id = ? AND ep.status = 'active'`,
      [tenantId]
    );

    return stats[0];
  }
};

module.exports = EMIModel;
