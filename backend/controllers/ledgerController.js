const LedgerModel = require('../models/ledgerModel');

const LedgerController = {
  // Get Party Ledger
  getPartyLedger: async (req, res) => {
    try {
      const tenantId = req.user.tenant_id || 1;
      const { partyId } = req.params;
      const fromDate = req.query.from_date || new Date(new Date().getFullYear(), 0, 1);
      const toDate = req.query.to_date || new Date();

      const ledger = await LedgerModel.getPartyLedger(tenantId, partyId, fromDate, toDate);
      
      res.json({
        success: true,
        data: ledger
      });
    } catch (error) {
      console.error('Get party ledger error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch party ledger',
        error: error.message
      });
    }
  },

  // Add Ledger Entry
  addLedgerEntry: async (req, res) => {
    try {
      const tenantId = req.user.tenant_id || 1;
      const entryData = {
        ...req.body,
        tenant_id: tenantId,
        created_by: req.user.userId
      };

      const result = await LedgerModel.addLedgerEntry(entryData);
      
      res.status(201).json({
        success: true,
        message: 'Ledger entry added successfully',
        data: result
      });
    } catch (error) {
      console.error('Add ledger entry error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to add ledger entry',
        error: error.message
      });
    }
  },

  // Get All Parties with Balances
  getAllPartiesWithBalances: async (req, res) => {
    try {
      const tenantId = req.user.tenant_id || 1;
      const partyType = req.query.party_type;

      const parties = await LedgerModel.getAllPartiesWithBalances(tenantId, partyType);
      
      res.json({
        success: true,
        data: parties
      });
    } catch (error) {
      console.error('Get parties error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch parties',
        error: error.message
      });
    }
  },

  // Get Ledger Summary
  getLedgerSummary: async (req, res) => {
    try {
      const tenantId = req.user.tenant_id || 1;
      const fromDate = req.query.from_date || new Date(new Date().getFullYear(), 0, 1);
      const toDate = req.query.to_date || new Date();

      const summary = await LedgerModel.getLedgerSummary(tenantId, fromDate, toDate);
      
      res.json({
        success: true,
        data: summary
      });
    } catch (error) {
      console.error('Get ledger summary error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch ledger summary',
        error: error.message
      });
    }
  },

  // Delete Ledger Entry
  deleteLedgerEntry: async (req, res) => {
    try {
      const tenantId = req.user.tenant_id || 1;
      const { id } = req.params;

      const result = await LedgerModel.deleteLedgerEntry(id, tenantId);
      
      res.json({
        success: true,
        message: 'Ledger entry deleted successfully'
      });
    } catch (error) {
      console.error('Delete ledger entry error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete ledger entry',
        error: error.message
      });
    }
  },

  // Export Ledger PDF
  exportLedgerPDF: async (req, res) => {
    try {
      const tenantId = req.user.tenant_id || 1;
      const { partyId } = req.params;
      const fromDate = req.query.from_date || new Date(new Date().getFullYear(), 0, 1);
      const toDate = req.query.to_date || new Date();

      const ledger = await LedgerModel.getPartyLedger(tenantId, partyId, fromDate, toDate);
      
      // TODO: Implement PDF generation
      // const pdfPath = await PDFService.generateLedgerPDF(ledger);
      
      res.json({
        success: true,
        message: 'PDF generation not yet implemented',
        data: ledger
      });
    } catch (error) {
      console.error('Export ledger PDF error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to export ledger PDF',
        error: error.message
      });
    }
  }
};

module.exports = LedgerController;
