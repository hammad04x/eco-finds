const categoryModel = require('../models/categoryModel');
const validate = require('../utils/validators');

const getCategories = async (req, res, next) => {
    try {
        const categories = await categoryModel.findAll();
        res.status(200).json({ success: true, data: categories });
    } catch (error) {
        next(error);
    }
};

const createCategory = async (req, res, next) => {
    try {
        const { name, status = 1 } = req.body;
        if (!name || !validate.isValidString(name)) {
            return res.status(400).json({ success: false, message: 'Category name is required' });
        }

        const categoryId = await categoryModel.create(name, status);
        res.status(201).json({ success: true, message: 'Category created', data: { id: categoryId, name, status } });
    } catch (error) {
        next(error);
    }
};

const updateCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, status } = req.body;
        if (!validate.isNumericId(id) || !validate.isValidString(name)) {
            return res.status(400).json({ success: false, message: 'Invalid ID or name' });
        }

        const updated = await categoryModel.update(id, name, status);
        if (updated) {
            res.status(200).json({ success: true, message: 'Category updated successfully' });
        } else {
            res.status(404).json({ success: false, message: 'Category not found or no changes made' });
        }
    } catch (error) {
        next(error);
    }
};

const deleteCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!validate.isNumericId(id)) {
            return res.status(400).json({ success: false, message: 'Invalid ID' });
        }

        const deleted = await categoryModel.remove(id);
        if (deleted) {
            res.status(200).json({ success: true, message: 'Category deleted successfully' });
        } else {
            res.status(404).json({ success: false, message: 'Category not found' });
        }
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
};