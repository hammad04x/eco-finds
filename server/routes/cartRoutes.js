const express = require('express');
const router = express.Router();
const { getCart, addItem, updateItemQuantity, removeItem, clearCart } = require('../controller/cartController');
const { protect } = require('../middleware/authMiddleware');

// Define /clear route before /:cartItemId
router.delete("/clear", protect, clearCart);
router.get('/', protect, getCart);
router.post('/', protect, addItem);
router.patch('/:cartItemId', protect, updateItemQuantity);
router.delete('/:cartItemId', protect, removeItem);

module.exports = router;