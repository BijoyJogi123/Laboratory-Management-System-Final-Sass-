const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Secret for signing JWT (should be stored securely, such as in .env)
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';



// Lab master login section 




// Google reCAPTCHA secret key (replace with your actual key)
const RECAPTCHA_SECRET_KEY = '6LdrPX0qAAAAAOpf4RkSVmHZevfpv5mr6ynk9HY0';

// Controller to handle login
// exports.loginUser = async (req, res) => {
//     const { username, password, captchaResponse } = req.body;

//     // Verify the CAPTCHA response with Google reCAPTCHA
//     const captchaResult = await verifyCaptcha(captchaResponse);

//     if (!captchaResult.success) {
//         return res.status(400).json({ status: 'fail', message: 'CAPTCHA verification failed.' });
//     }

//     // CAPTCHA is valid, now proceed with PHP authentication
//     try {
//         const response = await fetch('https://topfinglobal.com/backend/lab/userAuthenticate.php', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ username, password }),
//         });

//         const data = await response.json();

//         if (data.status === 'true' || data.status === true) {
//             // Success
//             res.json({ status: 'success' });
//         } else {
//             // Authentication failed
//             res.json({ status: 'fail', message: 'Invalid username or password.' });
//         }
//     } catch (error) {
//         console.error('Error during PHP authentication:', error);
//         res.status(500).json({ status: 'fail', message: 'Internal server error' });
//     }
// };









// User login function
exports.login = (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  User.getUserByEmail(email, (err, user) => {
    if (err) return res.status(500).json({ error: 'Server error' });
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    // Compare the provided password with the hashed password in the database
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) return res.status(500).json({ error: 'Server error' });
      if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

      // Generate JWT token if password matches
      const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

      // Return token to the client
      res.status(200).json({ token });
    });
  });
};