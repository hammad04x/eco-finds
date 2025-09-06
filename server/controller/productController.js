const productModel = require('../models/productModel');
const validate = require('../utils/validators');
const path = require('path');

const getProducts = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, search, category_id, sort = 'latest' } = req.query;
        const offset = (parseInt(page) - 1) * parseInt(limit);

        const filter = {
            search,
            category_id: category_id ? parseInt(category_id) : null,
            sortBy: sort,
            page: parseInt(page),
            limit: parseInt(limit),
        };

        const products = await productModel.find(filter);
        const totalProducts = await productModel.count(filter);

        res.status(200).json({
            success: true,
            data: {
                products,
                total: totalProducts,
                page: parseInt(page),
                pages: Math.ceil(totalProducts / parseInt(limit)),
            },
        });
    } catch (error) {
        next(error);
    }
};

const getProductById = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!validate.isNumericId(id)) {
            return res.status(400).json({ success: false, message: 'Invalid product ID' });
        }
        const product = await productModel.findById(id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.status(200).json({ success: true, data: product });
    } catch (error) {
        next(error);
    }
};

const createProduct = async (req, res, next) => {
    try {
        console.log('Request body:', req.body); // Log the incoming data
        console.log('Files:', req.files); // Log uploaded files

        const { title, description, price, category_id } = req.body;
        if (!title || !description || !price || !category_id) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        const userId = req.user?.id; // Check if req.user is defined
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized: User ID not found' });
        }

        let image = null;
        if (req.file) { // Use req.file instead of req.files for single upload
            image = path.join( req.file.filename);
        }

        const productId = await productModel.create(userId, category_id, title, description, price, image);
        const newProduct = await productModel.findById(productId);
        res.status(201).json({ success: true, message: 'Product created successfully', data: newProduct });
    } catch (error) {
        console.error('Error in createProduct:', error); // Log the error
        next(error); // Pass to error handler
    }
};

const updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const product = await productModel.findById(id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        if (product.user_id !== userId) {
            return res.status(403).json({ success: false, message: 'Not authorized to update this product' });
        }

        let image = product.image;
        if (req.files && req.files.length > 0) {
            image = path.join( req.files[0].filename); // Use first image
        }

        const updated = await productModel.update(id, { ...req.body, user_id: userId, image });
        if (updated) {
            const updatedProduct = await productModel.findById(id);
            res.status(200).json({ success: true, message: 'Product updated successfully', data: updatedProduct });
        } else {
            res.status(400).json({ success: false, message: 'Failed to update product' });
        }
    } catch (error) {
        next(error);
    }
};

const deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const product = await productModel.findById(id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        if (product.user_id !== userId) {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this product' });
        }

        const deleted = await productModel.remove(id);
        if (deleted) {
            res.status(200).json({ success: true, message: 'Product deleted successfully' });
        } else {
            res.status(400).json({ success: false, message: 'Failed to delete product' });
        }
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};