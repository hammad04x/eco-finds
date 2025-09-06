const pool = require('../connection/connection');


const findByUserId = async (userId) => {
    const [rows] = await pool.query(`
        SELECT c.id, c.product_id, c.quantity, p.title, p.price, p.image
        FROM cart c
        JOIN products p ON c.product_id = p.id
        WHERE c.user_id = ?
    `, [userId]);
    return rows;
};

const addToCart = async (userId, productId, quantity) => {
    const [existingItem] = await pool.query('SELECT * FROM cart WHERE user_id = ? AND product_id = ?', [userId, productId]);
    if (existingItem.length > 0) {
        const newQuantity = existingItem[0].quantity + quantity;
        const [result] = await pool.query('UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?', [newQuantity, userId, productId]);
        return result.affectedRows;
    } else {
        const [result] = await pool.query('INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)', [userId, productId, quantity]);
        return result.insertId;
    }
};

const updateQuantity = async (cartItemId, quantity) => {
    const [result] = await pool.query('UPDATE cart SET quantity = ? WHERE id = ?', [quantity, cartItemId]);
    return result.affectedRows;
};

const removeFromCart = async (cartItemId) => {
    const [result] = await pool.query('DELETE FROM cart WHERE id = ?', [cartItemId]);
    return result.affectedRows;
};

const clearCart = async (userId) => {
    await pool.query('DELETE FROM cart WHERE user_id = ?', [userId]);
};

module.exports = {
    findByUserId,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
};