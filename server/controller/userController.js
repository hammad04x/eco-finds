const userModel = require('../models/userModel');

const getMe = async (req, res, next) => {
    try {
        const user = req.user;
        res.status(200).json({
            success: true,
            data: {
                id: user.id,
                username: user.username,
                email: user.email,
                profile_image: user.profile_image,
            },
        });
    } catch (error) {
        next(error);
    }
};

const updateMe = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { username, email } = req.body;

        const updated = await userModel.update(userId, { username, email });
        if (updated) {
            const user = await userModel.findById(userId);
            res.status(200).json({
                success: true,
                message: 'Profile updated successfully',
                data: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    profile_image: user.profile_image,
                },
            });
        } else {
            res.status(404).json({ success: false, message: 'User not found or nothing to update' });
        }
    } catch (error) {
        next(error);
    }
};

const uploadAvatar = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        const userId = req.user.id;
        const avatarPath = `/uploads/avatars/${req.file.filename}`;
        
        const updated = await userModel.update(userId, { profile_image: avatarPath });
        
        if (updated) {
            res.status(200).json({
                success: true,
                message: 'Profile image updated successfully',
                data: { profile_image: avatarPath },
            });
        } else {
            res.status(500).json({ success: false, message: 'Failed to update profile image' });
        }
    } catch (error) {
        next(error);
    }
};

module.exports = { getMe, updateMe, uploadAvatar };