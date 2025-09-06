const orderModel = require('../models/orderModel');
const cartModel = require('../models/cartModel');
const pool = require('../connection/connection');

const checkout = async (req, res, next) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const userId = req.user.id;
        const cartItems = await cartModel.findByUserId(userId);

        if (cartItems.length === 0) {
            return res.status(400).json({ success: false, message: 'Your cart is empty' });
        }

        const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const orderId = await orderModel.createOrder(userId, totalAmount);
        await orderModel.createOrderItems(orderId, cartItems);
        await cartModel.clearCart(userId);

        await connection.commit();

        res.status(201).json({ success: true, message: 'Checkout successful', data: { orderId } });
    } catch (error) {
        await connection.rollback();
        next(error);
    } finally {
        connection.release();
    }
};

const getOrders = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const orders = await orderModel.findByUserId(userId);
        res.status(200).json({ success: true, data: orders });
    } catch (error) {
        next(error);
    }
};

const getOrderById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const orderDetails = await orderModel.findById(id);

        if (orderDetails.length === 0) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        if (orderDetails[0].user_id !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
        }

        // Format response to group items under one order
        const formattedOrder = {
            id: orderDetails[0].id,
            user_id: orderDetails[0].user_id,
            total_amount: orderDetails[0].total_amount,
            status: orderDetails[0].status,
            created_at: orderDetails[0].created_at,
            items: orderDetails.map(item => ({
                order_item_id: item.order_item_id,
                product_id: item.product_id,
                title: item.product_title,
                description: item.product_description,
                quantity: item.item_quantity,
                price: item.item_price,
            })),
        };

        res.status(200).json({ success: true, data: formattedOrder });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    checkout,
    getOrders,
    getOrderById,
};