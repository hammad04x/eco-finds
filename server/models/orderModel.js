const pool = require('../connection/connection');


const createOrder = async (userId, totalAmount) => {
    const [result] = await pool.query('INSERT INTO orders (user_id, total_amount, payment_method) VALUES (?, ?, ?)', [userId, totalAmount, 'Stripe']); // Hardcoded payment method for simplicity
    return result.insertId;
};

const createOrderItems = async (orderId, cartItems) => {
    const values = cartItems.map(item => [orderId, item.product_id, item.quantity, item.price]);
    await pool.query('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?', [values]);
};

const findByUserId = async (userId) => {
    const [rows] = await pool.query('SELECT * FROM orders WHERE user_id = ?', [userId]);
    return rows;
};

const findById = async (orderId) => {
    const [rows] = await pool.query(`
        SELECT o.*, oi.id as order_item_id, oi.quantity as item_quantity, oi.price as item_price,
               p.title as product_title, p.description as product_description
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        JOIN products p ON oi.product_id = p.id
        WHERE o.id = ?
    `, [orderId]);
    return rows;
};

module.exports = {
    createOrder,
    createOrderItems,
    findByUserId,
    findById,
};