const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const { verifyToken } = require('../middleware/auth');

// Configure multer for logo upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/logos';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'logo-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Check if file is an image
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Logo upload routes
router.post('/upload-logo', verifyToken, upload.single('logo'), settingsController.uploadLogo);
router.delete('/remove-logo', verifyToken, settingsController.removeLogo);

// Lab info routes
router.get('/lab-info', verifyToken, settingsController.getLabInfo);
router.put('/lab-info', verifyToken, settingsController.updateLabInfo);

module.exports = router;