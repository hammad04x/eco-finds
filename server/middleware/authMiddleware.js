const jwt = require('jsonwebtoken');
const pool = require('../connection/connection');

const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [decoded.id]);
            req.user = rows[0];
            next();
        } catch (error) {
            res.status(401).json({ success: false, message: 'Not authorized, token failed' });
        }
    }
    if (!token) {
        res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }
};

const admin = (req, res, next) => {
    if (req.user && req.user.is_admin) {
        next();
    } else {
        res.status(403).json({ success: false, message: 'Not authorized as an admin' });
    }
};

module.exports = { protect, admin };