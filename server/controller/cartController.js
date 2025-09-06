const cartModel = require('../models/cartModel');
const validate = require('../utils/validators');

const getCart = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const cartItems = await cartModel.findByUserId(userId);
        res.status(200).json({ success: true, data: cartItems });
    } catch (error) {
        next(error);
    }
};

const addItem = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { product_id, quantity = 1 } = req.body;
        if (!product_id || !validate.isNumericId(product_id) || quantity <= 0) {
            return res.status(400).json({ success: false, message: 'Invalid product ID or quantity' });
        }

        await cartModel.addToCart(userId, product_id, quantity);
        res.status(200).json({ success: true, message: 'Item added/updated in cart' });
    } catch (error) {
        next(error);
    }
};

const updateItemQuantity = async (req, res, next) => {
    try {
        const { cartItemId } = req.params;
        const { quantity } = req.body;
        if (!validate.isNumericId(cartItemId) || quantity === undefined || quantity < 0) {
            return res.status(400).json({ success: false, message: 'Invalid cart item ID or quantity' });
        }

        const updated = await cartModel.updateQuantity(cartItemId, quantity);
        if (updated) {
            res.status(200).json({ success: true, message: 'Cart item quantity updated' });
        } else {
            res.status(404).json({ success: false, message: 'Cart item not found' });
        }
    } catch (error) {
        next(error);
    }
};

const removeItem = async (req, res, next) => {
    try {
        const { cartItemId } = req.params;
        if (!validate.isNumericId(cartItemId)) {
            return res.status(400).json({ success: false, message: 'Invalid cart item ID' });
        }

        const removed = await cartModel.removeFromCart(cartItemId);
        if (removed) {
            res.status(200).json({ success: true, message: 'Item removed from cart' });
        } else {
            res.status(404).json({ success: false, message: 'Cart item not found' });
        }
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getCart,
    addItem,
    updateItemQuantity,
    removeItem,
};