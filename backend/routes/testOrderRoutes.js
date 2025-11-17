const express = require('express');
const router = express.Router();
const TestOrderController = require('../controllers/testOrderController');
const { verifyToken } = require('../middlewares/authMiddleware');

// All routes require authentication
router.use(verifyToken);

// Order routes
router.post('/', TestOrderController.createOrder);
router.get('/', TestOrderController.getAllOrders);
router.get('/pending', TestOrderController.getPendingOrders);
router.get('/overdue', TestOrderController.getOverdueOrders);
router.get('/stats', TestOrderController.getOrderStats);
router.get('/status/:status', TestOrderController.getOrdersByStatus);
router.get('/:id', TestOrderController.getOrderById);
router.put('/:id/status', TestOrderController.updateOrderStatus);
router.put('/:id/assign', TestOrderController.assignOrder);
router.delete('/:id', TestOrderController.deleteOrder);

module.exports = router;
