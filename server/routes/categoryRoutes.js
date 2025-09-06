const express = require('express');
const router = express.Router();
const { getCategories, createCategory, updateCategory, deleteCategory } = require('../controller/categoryController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getCategories);
router.post('/add', protect, createCategory);
router.patch('/:id', protect, updateCategory);
router.delete('/:id', protect, deleteCategory);

module.exports = router;