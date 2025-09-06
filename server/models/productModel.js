const pool = require('../connection/connection');

const create = async (userId, categoryId, title, description, price, image = null) => {
    const [result] = await pool.query(
        'INSERT INTO products (user_id, category_id, title, description, price, image) VALUES (?, ?, ?, ?, ?, ?)',
        [userId, categoryId, title, description, price, image]
    );
    return result.insertId;
};

const findById = async (id) => {
    const [rows] = await pool.query(
        'SELECT p.*, c.name as category_name, u.username as seller_username FROM products p ' +
        'JOIN categories c ON p.category_id = c.id ' +
        'JOIN users u ON p.user_id = u.id WHERE p.id = ?',
        [id]
    );
    return rows[0];
};

const update = async (id, data) => {
    const { user_id, category_id, title, description, price, image } = data;
    const [result] = await pool.query(
        'UPDATE products SET user_id = ?, category_id = ?, title = ?, description = ?, price = ?, image = ? WHERE id = ?',
        [user_id, category_id, title, description, price, image, id]
    );
    return result.affectedRows;
};

const remove = async (id) => {
    const [result] = await pool.query('DELETE FROM products WHERE id = ?', [id]);
    return result.affectedRows;
};

const find = async ({ search, category_id, sortBy, page, limit }) => {
    let query = 'SELECT p.*, c.name as category_name, u.username as seller_username FROM products p ' +
                'JOIN categories c ON p.category_id = c.id ' +
                'JOIN users u ON p.user_id = u.id WHERE 1=1';
    const params = [];

    if (search) {
        query += ' AND p.title LIKE ?';
        params.push(`%${search}%`);
    }

    if (category_id) {
        query += ' AND p.category_id = ?';
        params.push(category_id);
    }

    switch (sortBy) {
        case 'price_asc':
            query += ' ORDER BY p.price ASC';
            break;
        case 'price_desc':
            query += ' ORDER BY p.price DESC';
            break;
        case 'latest':
        default:
            query += ' ORDER BY p.created_at DESC';
            break;
    }

    const offset = (page - 1) * limit;
    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await pool.query(query, params);
    return rows;
};

const count = async ({ search, category_id }) => {
    let query = 'SELECT COUNT(*) as total FROM products WHERE 1=1';
    const params = [];
    if (search) {
        query += ' AND title LIKE ?';
        params.push(`%${search}%`);
    }
    if (category_id) {
        query += ' AND category_id = ?';
        params.push(category_id);
    }
    const [rows] = await pool.query(query, params);
    return rows[0].total;
};

module.exports = {
    create,
    findById,
    update,
    remove,
    find,
    count,
};