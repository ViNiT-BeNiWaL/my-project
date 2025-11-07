const express = require('express');
const { body } = require('express-validator');
const { register, login } = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

// Register user
router.post(
  '/register',
  [
    body('username').isLength({ min: 3 }).withMessage('Username min length is 3'),
    body('password').isLength({ min: 5 }).withMessage('Password min length is 5'),
  ],
  register
);

// Login user
router.post(
  '/login',
  [
    body('username').exists().withMessage('Username is required'),
    body('password').exists().withMessage('Password is required'),
  ],
  login
);

// Get current logged-in user info
router.get('/me', authenticate, (req, res) => {
  // Return both _id and username for frontend filtering
  res.json({
    _id: req.user._id,
    username: req.user.username,
  });
});

module.exports = router;
