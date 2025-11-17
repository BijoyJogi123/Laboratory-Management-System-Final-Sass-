const InventoryModel = require('../models/inventoryModel');

const InventoryController = {
  // Create Item
  createItem: async (req, res) => {
    try {
      const tenantId = req.user.tenant_id || 1;
      const itemData = {
        ...req.body,
        tenant_id: tenantId
      };

      const result = await InventoryModel.createItem(itemData);
      
      res.status(201).json({
        success: true,
        message: 'Inventory item created successfully',
        data: result
      });
    } catch (error) {
      console.error('Create inventory item error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create inventory item',
        error: error.message
      });
    }
  },

  // Get All Items
  getAllItems: async (req, res) => {
    try {
      const tenantId = req.user.tenant_id || 1;
      const filters = {
        category: req.query.category,
        is_active: req.query.is_active,
        search: req.query.search
      };

      const items = await InventoryModel.getAllItems(tenantId, filters);
      
      res.json({
        success: true,
        data: items
      });
    } catch (error) {
      console.error('Get inventory items error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch inventory items',
        error: error.message
      });
    }
  },

  // Get Item by ID
  getItemById: async (req, res) => {
    try {
      const tenantId = req.user.tenant_id || 1;
      const { id } = req.params;

      const item = await InventoryModel.getItemById(id, tenantId);
      
      if (!item) {
        return res.status(404).json({
          success: false,
          message: 'Inventory item not found'
        });
      }

      res.json({
        success: true,
        data: item
      });
    } catch (error) {
      console.error('Get inventory item error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch inventory item',
        error: error.message
      });
    }
  },

  // Update Item
  updateItem: async (req, res) => {
    try {
      const tenantId = req.user.tenant_id || 1;
      const { id } = req.params;

      const success = await InventoryModel.updateItem(id, tenantId, req.body);
      
      if (!success) {
        return res.status(404).json({
          success: false,
          message: 'Inventory item not found'
        });
      }

      res.json({
        success: true,
        message: 'Inventory item updated successfully'
      });
    } catch (error) {
      console.error('Update inventory item error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update inventory item',
        error: error.message
      });
    }
  },

  // Delete Item
  deleteItem: async (req, res) => {
    try {
      const tenantId = req.user.tenant_id || 1;
      const { id } = req.params;

      const success = await InventoryModel.deleteItem(id, tenantId);
      
      if (!success) {
        return res.status(404).json({
          success: false,
          message: 'Inventory item not found'
        });
      }

      res.json({
        success: true,
        message: 'Inventory item deleted successfully'
      });
    } catch (error) {
      console.error('Delete inventory item error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete inventory item',
        error: error.message
      });
    }
  },

  // Record Transaction
  recordTransaction: async (req, res) => {
    try {
      const tenantId = req.user.tenant_id || 1;
      const transactionData = {
        ...req.body,
        tenant_id: tenantId,
        created_by: req.user.userId
      };

      const result = await InventoryModel.recordTransaction(transactionData);
      
      res.status(201).json({
        success: true,
        message: 'Transaction recorded successfully',
        data: result
      });
    } catch (error) {
      console.error('Record transaction error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to record transaction',
        error: error.message
      });
    }
  },

  // Get Low Stock Items
  getLowStockItems: async (req, res) => {
    try {
      const tenantId = req.user.tenant_id || 1;

      const items = await InventoryModel.getLowStockItems(tenantId);
      
      res.json({
        success: true,
        data: items
      });
    } catch (error) {
      console.error('Get low stock items error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch low stock items',
        error: error.message
      });
    }
  },

  // Get Expiring Items
  getExpiringItems: async (req, res) => {
    try {
      const tenantId = req.user.tenant_id || 1;
      const daysAhead = parseInt(req.query.days) || 30;

      const items = await InventoryModel.getExpiringItems(tenantId, daysAhead);
      
      res.json({
        success: true,
        data: items
      });
    } catch (error) {
      console.error('Get expiring items error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch expiring items',
        error: error.message
      });
    }
  },

  // Get Inventory Statistics
  getInventoryStats: async (req, res) => {
    try {
      const tenantId = req.user.tenant_id || 1;

      const stats = await InventoryModel.getInventoryStats(tenantId);
      
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Get inventory stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch inventory statistics',
        error: error.message
      });
    }
  }
};

module.exports = InventoryController;
