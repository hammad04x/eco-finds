const pool = require('../connection/connection');


const findByEmail = async (email) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
};

const findById = async (id) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
};

const create = async (username, email, password) => {
    const [result] = await pool.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, password]);
    return result.insertId;
};

const update = async (id, data) => {
    const { username, email, profile_image } = data;
    const [result] = await pool.query('UPDATE users SET username = ?, email = ?, profile_image = ? WHERE id = ?', [username, email, profile_image, id]);
    return result.affectedRows;
};

module.exports = {
    findByEmail,
    findById,
    create,
    update,
};