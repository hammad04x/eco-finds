const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
const { generateToken } = require('../utils/jwt');
const validate = require('../utils/validators');

const signup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        if (!validate.isEmail(email) || !validate.isStrongPassword(password)) {
            return res.status(400).json({ success: false, message: 'Invalid email or password' });
        }

        const userExists = await userModel.findByEmail(email);
        if (userExists) {
            return res.status(409).json({ success: false, message: 'Email already in use' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userId = await userModel.create(username, email, hashedPassword);
        const newUser = await userModel.findById(userId);

        const token = generateToken(newUser.id);
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
                token,
            },
        });
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findByEmail(email);

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = generateToken(user.id);
            res.status(200).json({
                success: true,
                message: 'Login successful',
                data: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    token,
                },
            });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        next(error);
    }
};

module.exports = { signup, login };