// Routes for checkout
const express = require('express');
const router = express.Router();
const { calculateBestDeal } = require('../controllers/checkoutController');
const auth = require('../middleware/auth');

// Calculate best deal (can be public for anonymous users)
router.post('/calculate', calculateBestDeal);

module.exports = router;
