const express = require('express');
const router = express.Router();
const InventoryController = require('../controllers/inventoryController');
const { verifyToken } = require('../middlewares/authMiddleware');

// All routes require authentication
router.use(verifyToken);

// Inventory item routes
router.post('/items', InventoryController.createItem);
router.get('/items', InventoryController.getAllItems);
router.get('/items/:id', InventoryController.getItemById);
router.put('/items/:id', InventoryController.updateItem);
router.delete('/items/:id', InventoryController.deleteItem);

// Transaction routes
router.post('/transactions', InventoryController.recordTransaction);

// Alert routes
router.get('/low-stock', InventoryController.getLowStockItems);
router.get('/expiring', InventoryController.getExpiringItems);

// Statistics
router.get('/stats', InventoryController.getInventoryStats);

module.exports = router;
