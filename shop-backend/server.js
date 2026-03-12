// - Product reviews/ratings
// - Wishlist
// - Discount codes
// - Real payment (Stripe)
// - Email notifications
// - Product recommendations

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const apiLimiter = require('./middleware/rateLimiter');
require('dotenv').config();

const usersRoutes = require('./routes/users');
const cartsRoutes = require('./routes/carts');
const categoriesRoutes = require('./routes/categories');
const productsRoutes = require('./routes/products');
const ordersRoutes = require('./routes/orders');

const app = express();

const PORT = process.env.PORT || 3001;

const cleanupExpiredSessions = require('./utils/cleanupExpiredSessions');

// Removes expired sessions from a database
setInterval(async () => {
    try {
        await cleanupExpiredSessions();
    } catch (err) {
        console.log(err);
    };
}, 600000);

app.use(cors());
app.use(express.json());

// Extra layer of protection
app.use(helmet());

// Limit requests
app.use('/api', apiLimiter);

// Auth & Account management
app.use('/api/auth', usersRoutes);

// Cart management
app.use('/api/carts', cartsRoutes);

// Product categories
app.use('/api/categories', categoriesRoutes);

// Products
app.use('/api/products', productsRoutes);

// Order management
app.use('/api/orders', ordersRoutes);

// 404 Error handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        info: "Route not found"
    });
});

// Global error handler
app.use((err, req, res, next) => {

    console.error(err);

    res.status(err.status || 500).json({
        success: false,
        info: err.message || "Internal server error"
    });

});

app.listen(PORT, () => {
    console.log(`API ready at http://localhost:${PORT}/api`);
});
