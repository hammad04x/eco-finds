const pool = require('../connection/connection');


const findAll = async () => {
    const [rows] = await pool.query('SELECT * FROM categories');
    return rows;
};

const create = async (name) => {
    const [result] = await pool.query('INSERT INTO categories (name) VALUES (?)', [name]);
    return result.insertId;
};

const update = async (id, name) => {
    const [result] = await pool.query('UPDATE categories SET name = ? WHERE id = ?', [name, id]);
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