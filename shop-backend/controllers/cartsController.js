const CartItems = require('../models/CartItems');
const Products = require('../models/Products');
const asyncHandler = require('../utils/asyncHandler');
const countDecimals = require('../utils/countDecimals');
const filter = require('../utils/filter');

// Get all user's cart items by filter
// Available filters: name, category_id, sort, sort_type, price_min, price_max, is_featured
const checkCart = asyncHandler (async (req, res) => {

    const name = req.query.name !== undefined ? req.query.name : "";
    const category_id = +req.query.category_id || undefined;
    const sort = req.query.sort || "added_at";
    const sort_type = req.query.sort_type || "DESC";
    const price_min = req.query.price_min !== undefined ? +req.query.price_min : 0;
    const price_max = req.query.price_max !== undefined ? +req.query.price_max : 10000;
    const is_featured = !!req.query.is_featured;
    const limit = +req.query.limit || 10;
    const offset = +req.query.offset || 0;

    const query = filter(false, "cart_items", category_id, sort, sort_type, price_min, price_max, is_featured, offset);

    if (query === "Error") {
        return res.status(400).json({
            success: false,
            info: "Invalid input"
        });
    }

    const user_id = +req.user.id;
    
    const cart = await CartItems.searchQuery(query, user_id, name, price_min, price_max, limit, offset);
    
    res.status(200).json({
        success: true,
        data: cart,
        info: "Retrieved cart"
    });

});

// Post new item to a user's cart or put if item already exists
const postItem = asyncHandler (async (req, res) => {
    
    const user_id = +req.user.id;
    const product_id = +req.params.product_id;
    const { unit } = req.body;
    const quantity = parseFloat(req.body.quantity);

    const allowedUnit = ["kg", "piece", "liter"];

    if (!allowedUnit.includes(unit)) {
        return res.status(400).json({ 
        success: false, 
        info: 'Invalid unit' 
        });
    }

    if (Number.isNaN(quantity)) {
        return res.status(400).json({
            success: false,
            info: "Invalid quantity"
        });
    }

    if (unit === "kg" && quantity < 0.05) {
        return res.status(400).json({ 
            success: false, 
            info: 'Invalid kg quantity' 
        });
    }

    if (unit === "liter" && quantity < 0.5) {
        return res.status(400).json({ 
            success: false, 
            info: 'Invalid liter quantity' 
        });
    }

    if (unit === "piece" && (quantity < 1 || countDecimals(quantity) > 0)) {
        return res.status(400).json({ 
            success: false, 
            info: 'Invalid piece quantity' 
        });
    }

    const product = await Products.getProduct(product_id);

    if (product.unit !== unit) {
        res.status(400).json({
            success: false,
            info: "Invalid unit"
        });
    }

    if (parseFloat(product.stock) - quantity < 0) {
        return res.status(400).json({
            success: false,
            info: "Not enough in a stock"
        });
    }

    const cart_item = await CartItems.checkIfItemIsAdded(user_id, product_id);

    if (cart_item !== undefined) {
        const updated_quantity = parseFloat(cart_item.quantity) + quantity;

        await CartItems.updateItemQuantity(user_id, product_id, updated_quantity);

        return res.status(200).json({
            success: true,
            info: "Updated quantity of an item"
        });
    }

    await CartItems.postItem(user_id, product_id, quantity);

    res.status(201).json({
        success: true,
        info: "Item was added"
    });

});

// Update quantity of an item in a user's cart
const updateItemQuantity = asyncHandler (async (req, res) => {

    const user_id = +req.user.id;
    const product_id = +req.params.product_id;
    const quantity = parseFloat(req.body.quantity);

    const cart_item = await CartItems.checkIfItemIsAdded(user_id, product_id);

    if (cart_item === undefined) {
        return res.status(404).json({
            success: false,
            info: "Item with such ID is not found in user cart"
        });
    }

    if (cart_item.user_id !== user_id) {
        return res.status(403).json({
            success: false,
            info: "Forbidden"
        })
    }

    const product = await Products.getProduct(product_id);

    if (parseFloat(product.stock) - quantity < 0) {
        return res.status(400).json({
            success: false,
            info: "Not enough in a stock"
        });
    }

    await CartItems.updateItemQuantity(user_id, product_id, quantity);

    res.status(200).json({
        success: true,
        info: 'Updated quantity of an item'
    });

});

// Delete item from a user's cart
const deleteItem = asyncHandler (async (req, res) => {

    const user_id = +req.user.id;
    const product_id = +req.params.product_id;

    const cart_item = await CartItems.checkIfItemIsAdded(user_id, product_id);

    if (cart_item === undefined) {
        return res.status(404).json({
            success: false,
            info: "Item with such ID is not found in user cart"
        });
    }

    if (cart_item.user_id !== user_id) {
        return res.status(403).json({
            success: false,
            info: "Forbidden"
        })
    }

    await CartItems.deleteItem(user_id, product_id);

    res.status(200).json({
        success: true,
        info: 'Item was deleted'
    });

});

// Delete items from a user's cart that were placed in order
const deleteOrderItems = asyncHandler (async (req, res) => {

    const user_id = +req.user.id;
    const cart_items = req.query.cart_items;

    if (!cart_items) {
        return res.status(400).json({
            success: false,
            info: "Invalid cart"
        });
    }

    if (Array.isArray(cart_items)) {
        let err = false;;
        
        const filteredCart = cart_items.map(ci => {
            const newCi = +ci;

            if (Number.isNaN(ci)) {
                let err = true;
            } else {
                return newCi;
            }
        });

        if (err) {
            return res.status(400).json({
                success: false,
                info: "Wrong format"
            });
        }

        await CartItems.deleteOrderItems(user_id, filteredCart);
        
    } else {
        await CartItems.deleteItem(user_id, +cart_items);
    }

    res.status(200).json({
        success: true,
        info: "Items were deleted"
    });

});

module.exports = {
    checkCart,
    postItem,
    updateItemQuantity,
    deleteItem,
    deleteOrderItems
};