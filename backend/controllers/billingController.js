const BillingModel = require('../models/billingModel');

const BillingController = {
  // Create Invoice
  createInvoice: async (req, res) => {
    try {
      const tenantId = req.user.tenant_id || 1; // Get from auth middleware
      const invoiceData = {
        ...req.body,
        tenant_id: tenantId,
        created_by: req.user.userId
      };

      // Generate invoice number if not provided
      if (!invoiceData.invoice_number) {
        invoiceData.invoice_number = await BillingModel.generateInvoiceNumber(tenantId);
      }

      const result = await BillingModel.createInvoice(invoiceData);
      
      res.status(201).json({
        success: true,
        message: 'Invoice created successfully',
        data: result
      });
    } catch (error) {
      console.error('Create invoice error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create invoice',
        error: error.message
      });
    }
  },

  // Get All Invoices
  getAllInvoices: async (req, res) => {
    try {
      const tenantId = req.user.tenant_id || 1;
      const filters = {
        payment_status: req.query.payment_status,
        from_date: req.query.from_date,
        to_date: req.query.to_date,
        search: req.query.search,
        limit: req.query.limit || 50,
        offset: req.query.offset || 0
      };

      const invoices = await BillingModel.getAllInvoices(tenantId, filters);
      
      res.json({
        success: true,
        data: invoices,
        count: invoices.length
      });
    } catch (error) {
      console.error('Get invoices error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch invoices',
        error: error.message
      });
    }
  },

  // Get Invoice by ID
  getInvoiceById: async (req, res) => {
    try {
      const tenantId = req.user.tenant_id || 1;
      const { id } = req.params;

      const invoice = await BillingModel.getInvoiceById(id, tenantId);
      
      if (!invoice) {
        return res.status(404).json({
          success: false,
          message: 'Invoice not found'
        });
      }

      res.json({
        success: true,
        data: invoice
      });
    } catch (error) {
      console.error('Get invoice error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch invoice',
        error: error.message
      });
    }
  },

  // Update Invoice
  updateInvoice: async (req, res) => {
    try {
      const tenantId = req.user.tenant_id || 1;
      const { id } = req.params;

      const success = await BillingModel.updateInvoice(id, tenantId, req.body);
      
      if (!success) {
        return res.status(404).json({
          success: false,
          message: 'Invoice not found or update failed'
        });
      }

      res.json({
        success: true,
        message: 'Invoice updated successfully'
      });
    } catch (error) {
      console.error('Update invoice error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update invoice',
        error: error.message
      });
    }
  },

  // Record Payment
  recordPayment: async (req, res) => {
    try {
      const tenantId = req.user.tenant_id || 1;
      const { id } = req.params;
      const paymentData = {
        ...req.body,
        received_by: req.user.userId,
        transaction_number: req.body.transaction_number || `TXN-${Date.now()}`
      };

      const result = await BillingModel.recordPayment(id, tenantId, paymentData);
      
      res.json({
        success: true,
        message: 'Payment recorded successfully',
        data: result
      });
    } catch (error) {
      console.error('Record payment error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to record payment',
        error: error.message
      });
    }
  },

  // Delete Invoice
  deleteInvoice: async (req, res) => {
    try {
      const tenantId = req.user.tenant_id || 1;
      const { id } = req.params;

      const success = await BillingModel.deleteInvoice(id, tenantId);
      
      if (!success) {
        return res.status(404).json({
          success: false,
          message: 'Invoice not found'
        });
      }

      res.json({
        success: true,
        message: 'Invoice deleted successfully'
      });
    } catch (error) {
      console.error('Delete invoice error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete invoice',
        error: error.message
      });
    }
  },

  // Get Invoice Statistics
  getInvoiceStats: async (req, res) => {
    try {
      const tenantId = req.user.tenant_id || 1;
      const fromDate = req.query.from_date || new Date(new Date().getFullYear(), 0, 1);
      const toDate = req.query.to_date || new Date();

      const stats = await BillingModel.getInvoiceStats(tenantId, fromDate, toDate);
      
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Get stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch statistics',
        error: error.message
      });
    }
  }
};

module.exports = BillingController;
