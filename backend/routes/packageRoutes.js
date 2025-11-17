const express = require('express');
const router = express.Router();
const PackageController = require('../controllers/packageController');
const { verifyToken } = require('../middlewares/authMiddleware');

// All routes require authentication
router.use(verifyToken);

// Package routes
router.post('/', PackageController.createPackage);
router.get('/', PackageController.getAllPackages);
router.get('/stats', PackageController.getPackageStats);
router.get('/:id', PackageController.getPackageById);
router.put('/:id', PackageController.updatePackage);
router.delete('/:id', PackageController.deletePackage);

module.exports = router;
