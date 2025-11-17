const TestOrderModel = require('../models/testOrderModel');

const TestOrderController = {
  // Create Order
  createOrder: async (req, res) => {
    try {
      const tenantId = req.user.tenant_id || 1;
      const orderData = {
        ...req.body,
        tenant_id: tenantId,
        order_number: req.body.order_number || `ORD-${Date.now()}`
      };

      const result = await TestOrderModel.createOrder(orderData);
      
      res.status(201).json({
        success: true,
        message: 'Test order created successfully',
        data: result
      });
    } catch (error) {
      console.error('Create order error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create test order',
        error: error.message
      });
    }
  },

  // Get All Orders
  getAllOrders: async (req, res) => {
    try {
      const tenantId = req.user.tenant_id || 1;
      const filters = {
        status: req.query.status,
        priority: req.query.priority,
        from_date: req.query.from_date,
        to_date: req.query.to_date
      };

      const orders = await TestOrderModel.getAllOrders(tenantId, filters);
      
      res.json({
        success: true,
        data: orders
      });
    } catch (error) {
      console.error('Get orders error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch orders',
        error: error.message
      });
    }
  },

  // Get Order by ID
  getOrderById: async (req, res) => {
    try {
      const tenantId = req.user.tenant_id || 1;
      const { id } = req.params;

      const order = await TestOrderModel.getOrderById(id, tenantId);
      
      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      res.json({
        success: true,
        data: order
      });
    } catch (error) {
      console.error('Get order error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch order',
        error: error.message
      });
    }
  },

  // Update Order Status
  updateOrderStatus: async (req, res) => {
    try {
      const tenantId = req.user.tenant_id || 1;
      const { id } = req.params;

      const success = await TestOrderModel.updateOrderStatus(id, tenantId, req.body);
      
      if (!success) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      res.json({
        success: true,
        message: 'Order status updated successfully'
      });
    } catch (error) {
      console.error('Update order status error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update order status',
        error: error.message
      });
    }
  },

  // Assign Order
  assignOrder: async (req, res) => {
    try {
      const tenantId = req.user.tenant_id || 1;
      const { id } = req.params;
      const { user_id } = req.body;

      const success = await TestOrderModel.assignOrder(id, tenantId, user_id);
      
      if (!success) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      res.json({
        success: true,
        message: 'Order assigned successfully'
      });
    } catch (error) {
      console.error('Assign order error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to assign order',
        error: error.message
      });
    }
  },

  // Get Orders by Status
  getOrdersByStatus: async (req, res) => {
    try {
      const tenantId = req.user.tenant_id || 1;
      const { status } = req.params;

      const orders = await TestOrderModel.getOrdersByStatus(tenantId, status);
      
      res.json({
        success: true,
        data: orders
      });
    } catch (error) {
      console.error('Get orders by status error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch orders',
        error: error.message
      });
    }
  },

  // Get Pending Orders
  getPendingOrders: async (req, res) => {
    try {
      const tenantId = req.user.tenant_id || 1;

      const orders = await TestOrderModel.getPendingOrders(tenantId);
      
      res.json({
        success: true,
        data: orders
      });
    } catch (error) {
      console.error('Get pending orders error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch pending orders',
        error: error.message
      });
    }
  },

  // Get Overdue Orders
  getOverdueOrders: async (req, res) => {
    try {
      const tenantId = req.user.tenant_id || 1;

      const orders = await TestOrderModel.getOverdueOrders(tenantId);
      
      res.json({
        success: true,
        data: orders
      });
    } catch (error) {
      console.error('Get overdue orders error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch overdue orders',
        error: error.message
      });
    }
  },

  // Get Order Statistics
  getOrderStats: async (req, res) => {
    try {
      const tenantId = req.user.tenant_id || 1;

      const stats = await TestOrderModel.getOrderStats(tenantId);
      
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Get order stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch order statistics',
        error: error.message
      });
    }
  },

  // Delete Order
  deleteOrder: async (req, res) => {
    try {
      const tenantId = req.user.tenant_id || 1;
      const { id } = req.params;

      const success = await TestOrderModel.deleteOrder(id, tenantId);
      
      if (!success) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      res.json({
        success: true,
        message: 'Order deleted successfully'
      });
    } catch (error) {
      console.error('Delete order error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete order',
        error: error.message
      });
    }
  }
};

module.exports = TestOrderController;
