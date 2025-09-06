const pool = require('../connection/connection');

const findAll = async () => {
    const [rows] = await pool.query('SELECT * FROM categories');
    return rows;
};

const create = async (name, status = 1) => {
    const [result] = await pool.query(
        'INSERT INTO categories (name, status) VALUES (?, ?)',
        [name, status]
    );
    return result.insertId;
};

const update = async (id, name, status) => {
    const [result] = await pool.query(
        'UPDATE categories SET name = ?, status = ? WHERE id = ?',
        [name, status, id]
    );
    return result.affectedRows;
};

const remove = async (id) => {
    const [result] = await pool.query('DELETE FROM categories WHERE id = ?', [id]);
    return result.affectedRows;
};

const findById = async (id) => {
    const [rows] = await pool.query('SELECT * FROM categories WHERE id = ?', [id]);
    return rows[0];
};

module.exports = {
    findAll,
    create,
    update,
    remove,
    findById,
};