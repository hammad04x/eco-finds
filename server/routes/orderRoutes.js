const express = require('express');
const router = express.Router();
const { checkout, getOrders, getOrderById } = require('../controller/orderController');
const { protect } = require('../middleware/authMiddleware');

router.post('/checkout', protect, checkout);
router.get('/', protect, getOrders);
router.get('/:id', protect, getOrderById);

module.exports = router;