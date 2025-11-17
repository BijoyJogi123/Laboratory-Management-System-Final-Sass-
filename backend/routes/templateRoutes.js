const express = require('express');
const router = express.Router();
const TemplateController = require('../controllers/templateController');
const { verifyToken } = require('../middlewares/authMiddleware');

// All routes require authentication
router.use(verifyToken);

// Template routes
router.post('/', TemplateController.createTemplate);
router.get('/', TemplateController.getAllTemplates);
router.get('/:id', TemplateController.getTemplateById);
router.put('/:id', TemplateController.updateTemplate);
router.delete('/:id', TemplateController.deleteTemplate);

// Asset routes
router.post('/assets', TemplateController.uploadAsset);
router.get('/assets/list', TemplateController.getAssets);

// Version routes
router.get('/:id/versions', TemplateController.getTemplateVersions);

module.exports = router;
