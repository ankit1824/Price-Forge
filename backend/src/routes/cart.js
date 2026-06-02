// Routes for cart management
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { addToCart, getCart, removeFromCart, clearCart } = require('../controllers/cartController');

// All cart routes require authentication
router.post('/add', auth, addToCart);
router.get('/', auth, getCart);
router.post('/remove', auth, removeFromCart);
router.post('/clear', auth, clearCart);

module.exports = router;
