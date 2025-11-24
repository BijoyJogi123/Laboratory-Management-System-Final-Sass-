const db = require('../config/db.config');

const BillingModel = {
  // Create Invoice
  createInvoice: async (invoiceData) => {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const [result] = await connection.query(
        `INSERT INTO invoices (
          tenant_id, invoice_number, invoice_date, due_date,
          patient_id, patient_name, patient_contact, patient_email, patient_address,
          subtotal, discount_amount, tax_amount, total_amount,
          paid_amount, balance_amount, payment_type, payment_status,
          notes, terms_conditions, created_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          invoiceData.tenant_id,
          invoiceData.invoice_number,
          invoiceData.invoice_date,
          invoiceData.due_date,
          invoiceData.patient_id,
          invoiceData.patient_name,
          invoiceData.patient_contact,
          invoiceData.patient_email,
          invoiceData.patient_address,
          invoiceData.subtotal,
          invoiceData.discount_amount || 0,
          invoiceData.tax_amount || 0,
          invoiceData.total_amount,
          invoiceData.paid_amount || 0,
          invoiceData.balance_amount,
          invoiceData.payment_type || 'full',
          invoiceData.payment_status || 'unpaid',
          invoiceData.notes,
          invoiceData.terms_conditions,
          invoiceData.created_by
        ]
      );

      const invoiceId = result.insertId;

      // Insert invoice items
      if (invoiceData.items && invoiceData.items.length > 0) {
        for (const item of invoiceData.items) {
          await connection.query(
            `INSERT INTO invoice_items (
              invoice_id, item_type, item_name, description,
              quantity, unit_price, discount_percent, discount_amount,
              tax_percent, tax_amount, total_amount, test_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              invoiceId,
              item.item_type,
              item.item_name,
              item.description,
              item.quantity || 1,
              item.unit_price,
              item.discount_percent || 0,
              item.discount_amount || 0,
              item.tax_percent || 0,
              item.tax_amount || 0,
              item.total_amount,
              item.test_id
            ]
          );
        }
      }

      await connection.commit();
      return { invoiceId, success: true };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  // Get All Invoices
  getAllInvoices: async (tenantId, filters = {}) => {
    let query = `
      SELECT i.*, 
        COALESCE(p.patient_name, i.patient_name) as patient_name,
        COUNT(ii.item_id) as item_count
      FROM invoices i
      LEFT JOIN invoice_items ii ON i.invoice_id = ii.invoice_id
      LEFT JOIN patients p ON i.patient_id = p.id
      WHERE i.tenant_id = ?
    `;
    const params = [tenantId];

    if (filters.payment_status) {
      query += ` AND i.payment_status = ?`;
      params.push(filters.payment_status);
    }

    if (filters.from_date) {
      query += ` AND i.invoice_date >= ?`;
      params.push(filters.from_date);
    }

    if (filters.to_date) {
      query += ` AND i.invoice_date <= ?`;
      params.push(filters.to_date);
    }

    if (filters.search) {
      query += ` AND (i.invoice_number LIKE ? OR i.patient_name LIKE ?)`;
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    query += ` GROUP BY i.invoice_id ORDER BY i.invoice_date DESC`;

    if (filters.limit) {
      query += ` LIMIT ? OFFSET ?`;
      params.push(parseInt(filters.limit), parseInt(filters.offset || 0));
    }

    const [invoices] = await db.query(query, params);
    return invoices;
  },

  // Get Invoice by ID with patient and test details
  getInvoiceById: async (invoiceId, tenantId) => {
    const [invoices] = await db.query(
      `SELECT 
        i.*,
        COALESCE(p.patient_name, i.patient_name) as patient_name,
        p.phone as patient_phone,
        p.email as patient_email,
        p.address as patient_address
      FROM invoices i
      LEFT JOIN patients p ON i.patient_id = p.id
      WHERE i.invoice_id = ? AND i.tenant_id = ?`,
      [invoiceId, tenantId]
    );

    if (invoices.length === 0) return null;

    const invoice = invoices[0];

    // Get invoice items with test details
    const [items] = await db.query(
      `SELECT 
        ii.*,
        ii.item_name as test_name,
        ii.unit_price as test_price
      FROM invoice_items ii
      WHERE ii.invoice_id = ?`,
      [invoiceId]
    );

    invoice.items = items;
    return invoice;
  },

  // Update Invoice
  updateInvoice: async (invoiceId, tenantId, updateData) => {
    const [result] = await db.query(
      `UPDATE invoices SET
        patient_name = ?,
        patient_contact = ?,
        patient_email = ?,
        patient_address = ?,
        subtotal = ?,
        discount_amount = ?,
        tax_amount = ?,
        total_amount = ?,
        paid_amount = ?,
        balance_amount = ?,
        payment_status = ?,
        notes = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE invoice_id = ? AND tenant_id = ?`,
      [
        updateData.patient_name,
        updateData.patient_contact,
        updateData.patient_email,
        updateData.patient_address,
        updateData.subtotal,
        updateData.discount_amount,
        updateData.tax_amount,
        updateData.total_amount,
        updateData.paid_amount,
        updateData.balance_amount,
        updateData.payment_status,
        updateData.notes,
        invoiceId,
        tenantId
      ]
    );

    return result.affectedRows > 0;
  },

  // Record Payment
  recordPayment: async (invoiceId, tenantId, paymentData) => {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Get current invoice
      const [invoices] = await connection.query(
        `SELECT * FROM invoices WHERE invoice_id = ? AND tenant_id = ?`,
        [invoiceId, tenantId]
      );

      if (invoices.length === 0) {
        throw new Error('Invoice not found');
      }

      const invoice = invoices[0];
      const newPaidAmount = parseFloat(invoice.paid_amount) + parseFloat(paymentData.amount);
      const newBalance = parseFloat(invoice.total_amount) - newPaidAmount;

      let paymentStatus = 'unpaid';
      if (newBalance <= 0) {
        paymentStatus = 'paid';
      } else if (newPaidAmount > 0) {
        paymentStatus = 'partial';
      }

      // Update invoice
      await connection.query(
        `UPDATE invoices SET
          paid_amount = ?,
          balance_amount = ?,
          payment_status = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE invoice_id = ? AND tenant_id = ?`,
        [newPaidAmount, newBalance, paymentStatus, invoiceId, tenantId]
      );

      // Create payment transaction
      await connection.query(
        `INSERT INTO payment_transactions (
          tenant_id, invoice_id, transaction_number, transaction_date,
          amount, payment_mode, payment_reference, received_by, notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          tenantId,
          invoiceId,
          paymentData.transaction_number,
          paymentData.transaction_date || new Date(),
          paymentData.amount,
          paymentData.payment_mode,
          paymentData.payment_reference,
          paymentData.received_by,
          paymentData.notes
        ]
      );

      // Add ledger entry
      const [ledgerBalance] = await connection.query(
        `SELECT balance FROM party_ledger 
         WHERE tenant_id = ? AND party_id = ? 
         ORDER BY entry_date DESC, ledger_id DESC LIMIT 1`,
        [tenantId, invoice.patient_id]
      );

      const currentBalance = ledgerBalance.length > 0 ? parseFloat(ledgerBalance[0].balance) : 0;
      const newLedgerBalance = currentBalance - parseFloat(paymentData.amount);

      await connection.query(
        `INSERT INTO party_ledger (
          tenant_id, party_id, party_name, party_type, entry_date,
          voucher_type, voucher_number, invoice_number, payment_mode,
          credit_amount, debit_amount, balance, description, created_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          tenantId,
          invoice.patient_id,
          invoice.patient_name,
          'patient',
          paymentData.transaction_date || new Date(),
          'payment',
          paymentData.transaction_number,
          invoice.invoice_number,
          paymentData.payment_mode,
          0,
          parseFloat(paymentData.amount),
          newLedgerBalance,
          `Payment received for invoice ${invoice.invoice_number}`,
          paymentData.received_by
        ]
      );

      await connection.commit();
      return { success: true, newBalance, paymentStatus };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  // Delete Invoice
  deleteInvoice: async (invoiceId, tenantId) => {
    const [result] = await db.query(
      `DELETE FROM invoices WHERE invoice_id = ? AND tenant_id = ?`,
      [invoiceId, tenantId]
    );
    return result.affectedRows > 0;
  },

  // Generate Invoice Number
  generateInvoiceNumber: async (tenantId) => {
    const [tenant] = await db.query(
      `SELECT tenant_code FROM tenants WHERE tenant_id = ?`,
      [tenantId]
    );

    if (tenant.length === 0) {
      throw new Error('Tenant not found');
    }

    const tenantCode = tenant[0].tenant_code;
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;
    const financialYear = `${currentYear.toString().slice(-2)}-${nextYear.toString().slice(-2)}`;

    const [lastInvoice] = await db.query(
      `SELECT invoice_number FROM invoices 
       WHERE tenant_id = ? AND invoice_number LIKE ?
       ORDER BY invoice_id DESC LIMIT 1`,
      [tenantId, `${tenantCode}/${tenantCode}/${financialYear}/%`]
    );

    let sequenceNumber = 1;
    if (lastInvoice.length > 0) {
      const lastNumber = lastInvoice[0].invoice_number.split('/').pop();
      sequenceNumber = parseInt(lastNumber) + 1;
    }

    return `${tenantCode}/${tenantCode}/${financialYear}/${sequenceNumber}`;
  },

  // Get Invoice Statistics
  getInvoiceStats: async (tenantId, fromDate, toDate) => {
    const [stats] = await db.query(
      `SELECT 
        COUNT(*) as total_invoices,
        SUM(total_amount) as total_amount,
        SUM(paid_amount) as total_paid,
        SUM(balance_amount) as total_balance,
        SUM(CASE WHEN payment_status = 'paid' THEN 1 ELSE 0 END) as paid_count,
        SUM(CASE WHEN payment_status = 'unpaid' THEN 1 ELSE 0 END) as unpaid_count,
        SUM(CASE WHEN payment_status = 'partial' THEN 1 ELSE 0 END) as partial_count
      FROM invoices
      WHERE tenant_id = ? AND invoice_date BETWEEN ? AND ?`,
      [tenantId, fromDate, toDate]
    );

    return stats[0];
  }
};

module.exports = BillingModel;
