// ### **Bonus Features (If Time):**
// - Product reviews/ratings
// - Wishlist
// - Discount codes
// - Real payment (Stripe)
// - Email notifications
// - Product recommendations

// online-shop-frontend/
// ├── src/
// │   ├── App.jsx
// │   ├── pages/
// │   │   ├── Home.jsx
// │   │   ├── Products.jsx
// │   │   ├── ProductDetail.jsx
// │   │   ├── Cart.jsx
// │   │   ├── Checkout.jsx
// │   │   ├── Orders.jsx
// │   │   └── Admin/
// │   ├── components/
// │   │   ├── Navbar.jsx
// │   │   ├── ProductCard.jsx
// │   │   ├── CartItem.jsx
// │   │   └── ...
// │   └── api/
// │       └── api.js (all fetch functions)

// ### **4. Products table features:**
// - `stock` - inventory management
// - `is_active` - hide without deleting
// - `is_featured` - show on homepage
// - `sku` - barcode/product code
// - `unit` - kg, piece, liter

// ### **5. Orders table - why so many fields:**
// - **Snapshot shipping address** - customer might move!
// - `status` - track order lifecycle
// - `payment_status` - separate from order status
// - `customer_notes` - "Please ring doorbell"
// - `admin_notes` - internal notes

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const usersRoutes = require('./routes/users');
const cartsRoutes = require('./routes/carts');
const categoriesRoutes = require('./routes/categories');
const productsRoutes = require('./routes/products');
const ordersRoutes = require('./routes/orders');

const app = express();

const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

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
