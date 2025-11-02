// routes/authRoutes.js
const express = require('express');
const svgCaptcha = require('svg-captcha');
const router = express.Router();
const session = require('express-session');
const authController = require('../controllers/authController');


// Initialize session middleware to store CAPTCHA
router.use(session({
  secret: 'boom',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));


// Login route
router.post('/login-user', authController.login);

    let captureTest = null;
    
  // Generate CAPTCHA
  router.get('/generate-captcha', (req, res) => {
    captureTest = null;
    const captcha = svgCaptcha.create();  // Generate CAPTCHA
    captureTest = captcha.text;   // Store CAPTCHA text in session
    res.type('svg');
    console.log(captureTest,"this is captcha")
    res.status(200).send(captcha.data);   // Send CAPTCHA image as SVG
  });
  
  // Verify CAPTCHA and then allow login to PHP server
  router.post('/verify-captcha', (req, res) => {
    const { captcha } = req.body;
    console.log(captcha,"this is captcha POST")
    // Check if CAPTCHA is correct
    if (captcha === captureTest) {
        
      res.status(200).json({ success: true, message: "CAPTCHA verified" });
    
    } else {

        console.log(captureTest,"herere")
      res.status(400).json({ success: false, message: "Invalid CAPTCHA" });
    
    }
  });



module.exports = router;
