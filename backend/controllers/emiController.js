const EMIModel = require('../models/emiModel');

const EMIController = {
  // Create EMI Plan
  createEMIPlan: async (req, res) => {
    try {
      const tenantId = req.user.tenant_id || 1;
      const emiData = {
        ...req.body,
        tenant_id: tenantId
      };

      // Calculate EMI if not provided
      if (!emiData.emi_amount) {
        const principal = parseFloat(emiData.total_amount) - parseFloat(emiData.down_payment || 0);
        emiData.emi_amount = EMIModel.calculateEMI(
          principal,
          emiData.interest_rate || 0,
          emiData.number_of_installments
        );
      }

      // Calculate interest amount
      const totalEMI = emiData.emi_amount * emiData.number_of_installments;
      const principal = parseFloat(emiData.total_amount) - parseFloat(emiData.down_payment || 0);
      emiData.interest_amount = totalEMI - principal;

      const result = await EMIModel.createEMIPlan(emiData);
      
      res.status(201).json({
        success: true,
        message: 'EMI plan created successfully',
        data: result
      });
    } catch (error) {
      console.error('Create EMI plan error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create EMI plan',
        error: error.message
      });
    }
  },

  // Get All EMI Plans
  getAllEMIPlans: async (req, res) => {
    try {
      const tenantId = req.user.tenant_id || 1;
      const filters = {
        status: req.query.status
      };

      const plans = await EMIModel.getAllEMIPlans(tenantId, filters);
      
      res.json({
        success: true,
        data: plans
      });
    } catch (error) {
      console.error('Get EMI plans error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch EMI plans',
        error: error.message
      });
    }
  },

  // Get EMI Plan by ID
  getEMIPlanById: async (req, res) => {
    try {
      const tenantId = req.user.tenant_id || 1;
      const { id } = req.params;

      const plan = await EMIModel.getEMIPlanById(id, tenantId);
      
      if (!plan) {
        return res.status(404).json({
          success: false,
          message: 'EMI plan not found'
        });
      }

      res.json({
        success: true,
        data: plan
      });
    } catch (error) {
      console.error('Get EMI plan error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch EMI plan',
        error: error.message
      });
    }
  },

  // Get Due Installments
  getDueInstallments: async (req, res) => {
    try {
      const tenantId = req.user.tenant_id || 1;
      const daysAhead = parseInt(req.query.days_ahead) || 7;

      const installments = await EMIModel.getDueInstallments(tenantId, daysAhead);
      
      res.json({
        success: true,
        data: installments
      });
    } catch (error) {
      console.error('Get due installments error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch due installments',
        error: error.message
      });
    }
  },

  // Get Overdue Installments
  getOverdueInstallments: async (req, res) => {
    try {
      const tenantId = req.user.tenant_id || 1;

      const installments = await EMIModel.getOverdueInstallments(tenantId);
      
      res.json({
        success: true,
        data: installments
      });
    } catch (error) {
      console.error('Get overdue installments error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch overdue installments',
        error: error.message
      });
    }
  },

  // Pay Installment
  payInstallment: async (req, res) => {
    try {
      const tenantId = req.user.tenant_id || 1;
      const { id } = req.params;
      const paymentData = {
        ...req.body,
        received_by: req.user.userId,
        transaction_number: req.body.transaction_number || `TXN-${Date.now()}`
      };

      const result = await EMIModel.payInstallment(id, tenantId, paymentData);
      
      res.json({
        success: true,
        message: 'Installment paid successfully',
        data: result
      });
    } catch (error) {
      console.error('Pay installment error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to pay installment',
        error: error.message
      });
    }
  },

  // Get EMI Statistics
  getEMIStats: async (req, res) => {
    try {
      const tenantId = req.user.tenant_id || 1;

      const stats = await EMIModel.getEMIStats(tenantId);
      
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Get EMI stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch EMI statistics',
        error: error.message
      });
    }
  }
};

module.exports = EMIController;
