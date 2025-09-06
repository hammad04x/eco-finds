const userModel = require('../models/userModel');

const getMe = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
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
    const { username, email } = req.body;
    if (!username && !email) {
      return res.status(400).json({ success: false, message: 'No fields to update' });
    }

    const data = {};
    if (username) data.username = username;
    if (email) data.email = email;

    // Check for duplicate username
    if (username) {
      const existingUserByUsername = await userModel.findByEmail(username); // Using findByEmail to check username (adjust if needed)
      if (existingUserByUsername && existingUserByUsername.id !== req.user.id) {
        return res.status(400).json({ success: false, message: 'Username already exists' });
      }
    }

    // Check for duplicate email
    if (email) {
      const existingUserByEmail = await userModel.findByEmail(email);
      if (existingUserByEmail && existingUserByEmail.id !== req.user.id) {
        return res.status(400).json({ success: false, message: 'Email already exists' });
      }
    }

    // Update user data
    const affectedRows = await userModel.update(req.user.id, data);
    if (affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Fetch updated user
    const updatedUser = await userModel.findById(req.user.id);
    res.status(200).json({
      success: true,
      data: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        profile_image: updatedUser.profile_image,
      },
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') { // MySQL error code for duplicate entry
      return res.status(400).json({ success: false, message: 'Duplicate username or email' });
    }
    next(error);
  }
};

const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const data = { profile_image: req.file.filename };

    // Update user data with profile image
    const affectedRows = await userModel.update(req.user.id, data);
    if (affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Fetch updated user
    const updatedUser = await userModel.findById(req.user.id);
    res.status(200).json({
      success: true,
      data: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        profile_image: updatedUser.profile_image,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getMe, updateMe, uploadAvatar };