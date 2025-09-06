const express = require('express');
const router = express.Router();
const { getMe, updateMe, uploadAvatar } = require('../controller/userController');
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// Serve static files from the uploads directory
router.use('/uploads', express.static(path.join(__dirname, '../../client/public/uploads')));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../client/public/uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage: storage });

router.get('/me', protect, getMe);
router.patch('/me', protect, updateMe);
router.patch('/me/avatar', protect, upload.single('avatar'), uploadAvatar);

module.exports = router;