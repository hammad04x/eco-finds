const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const db = require('./connection/connection');
const errorHandler = require('./middleware/errorHandler');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the uploads directory
app.use("/uploads", express.static("uploads"));

// Test DB connection
(async () => {
  try {
    const [rows] = await db.query('SELECT 1 + 1 AS solution');
    console.log('Successfully connected to the database!', rows[0].solution);
  } catch (err) {
    console.error('Database connection failed:', err.stack);
  }
})();

// Import and use routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

// Centralized error handler
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});