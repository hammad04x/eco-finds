const express = require('express');
const router = express.Router();
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controller/productController');
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadsDir = path.join(__dirname, '../../client/public/uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage: storage });

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/add', protect, upload.single('image'), createProduct); // Ensure 'image' matches frontend
router.patch('/:id', protect, upload.single('image'), updateProduct);
router.delete('/:id', protect, deleteProduct);

module.exports = router;    