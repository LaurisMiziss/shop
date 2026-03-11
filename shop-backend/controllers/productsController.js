const Products = require('../models/Products');
const Categories = require('../models/Categories');
const asyncHandler = require('../utils/asyncHandler');
const productsDuplicateCheck = require('../utils/productsDuplicateCheck');
const countDecimals = require('../utils/countDecimals');
const filter = require('../utils/filter');

// Get all products by filter
// Available filters: name, category_id, sort, sort_type, price_min, price_max, is_featured
const getProductsWithFilter = asyncHandler (async (req, res) => {

    const name = req.query.name !== undefined ? req.query.name : "";
    const category_id = +req.query.category_id || undefined;
    const sort = req.query.sort || "name";
    const sort_type = req.query.sort_type || "DESC";
    const price_min = req.query.price_min !== undefined ? +req.query.price_min : 0;
    const price_max = req.query.price_max !== undefined ? +req.query.price_max : 10000;
    const is_featured = !!req.query.is_featured;
    const limit = +req.query.limit || 10;
    const offset = +req.query.offset || 0;

    const query = filter("products", category_id, sort, sort_type, price_min, price_max, is_featured, offset);

    if (query === "Error") {
        return res.status(400).json({
            success: false,
            info: "Invalid input"
        });
    }

    const result = await Products.searchQuery(query, name, price_min, price_max, limit, offset);
    
    res.status(200).json({
        success: true,
        products: result,
        info: "Retrieved products"
    });

});

// Get all info about product
const getProduct = asyncHandler (async (req, res) => {

    const product_id = +req.params.product_id;

    const product = await Products.getProduct(product_id);

    if (!product) {
        return res.status(404).json({
            success: false,
            info: "Product with such ID is not found"
        });
    }

    res.status(200).json({
        success: true,
        data: product,
        info: "Product was retrieved"
    });

});

// Admin role required to use below controllers
// Check if product name is taken
const checkNameIsTaken = asyncHandler (async (req, res) => {

    const { name } = req.query;

    if (!name) {
        return res.status(400).json({
            success: false,
            info: "Missing required field(s)"
        });
    }

    const message = await productsDuplicateCheck(name);

    if (message !== "Duplicates are not found") {
        return res.status(409).json({
            success: false,
            info: message
        });
    }
    
    res.status(200).json({
        success: true,
        info: message
    });

});

// Post a new product, name, price and category_id can't be undefined
const postProduct = asyncHandler (async (req, res) => {

    const { 
        name, description, price, category_id, stock, sku, 
        image_url, images, weight, unit, is_active, is_featured
    } = req.body;

    const allowedUnit = ["kg", "piece", "liter"];

    if (!name || (price === undefined || price < 0) || !category_id || (unit !== undefined && !allowedUnit.includes(unit))) {
        return res.status(400).json({
            success: false,
            info: "Missing required field(s)"
        });
    }

    const message = await productsDuplicateCheck(name);

    if (message !== "Duplicates are not found") {
        return res.status(409).json({
            success: false,
            info: message
        });
    }

    const priceDecimals = countDecimals(price);

    if (priceDecimals > 2) {
        return res.status(400).json({
            success: false,
            info: "Invalid price"
        });
    }

    const category = await Categories.getCategory(category_id);

    if (!category) {
        return res.status(404).json({
            success: false,
            info: "Category with such ID is not found"
        });
    }

    const stockDecimals = countDecimals(stock);
    
    if (stock < 0 || stockDecimals !== 0) {
        return res.status(400).json({
            success: false,
            info: "Invalid stock number"
        });
    }
    
    if (weight < 0) {
        return res.status(400).json({
            success: false,
            info: "Invalid weight number"
        });
    }

    await Products.postProduct(
        name, description, price, category_id, stock, sku, 
        image_url, images, weight, unit, is_active, is_featured, new Date()
    );

    res.status(201).json({
        success: true,
        info: "New product was created" 
    });

});

// Available patch product fields: name, description, price, category_id, stock, sku, 
// image_url, images, weight, unit, is_active, is_featured
const patchProductField = asyncHandler (async (req, res) => {   

    const product_id = +req.params.product_id;
    const { 
        name, description, price, category_id, stock, sku, 
        image_url, images, weight, unit, is_active, is_featured
    } = req.body;

    const allowedUnit = ["kg", "piece", "liter"];

    const product = await Products.getProduct(product_id);

    if (!product) {
        return res.status(404).json({
            success: false,
            info: "Product with such ID is not found"
        });
    }

    const currentDate = new Date();

    if (name !== undefined) {
        const message = await productsDuplicateCheck(name);

        if (message !== "Duplicates are not found") {
            return res.status(409).json({
                success: false,
                info: message
            });
        }

        await Products.patchName(product_id, name, currentDate);
    }

    if (description !== undefined) {
        await Products.patchDescription(product_id, description, currentDate);
    }

    if (price !== undefined) {
        const decimals = countDecimals(price);

        if (price < 0 || decimals > 2) {
            return res.status(400).json({
                success: false,
                info: "Invalid price"
            });
        }

        await Products.patchPrice(product_id, price, currentDate);
    }

    if (category_id !== undefined) {
        const category = await Categories.getCategory(category_id);

        if (!category) {
            return res.status(404).json({
                success: false,
                info: "Category with such ID is not found"
            });
        }

        await Products.patchCategory(product_id, category_id, currentDate);
    }

    if (stock !== undefined) {
        const decimals = countDecimals(stock);

        if (stock < 0 || decimals !== 0) {
            return res.status(400).json({
                success: false,
                info: "Invalid stock"
            });
        }

        await Products.patchStock(product_id, stock, currentDate);
    }

    if (sku !== undefined) {
        await Products.patchSku(product_id, sku, currentDate);
    }

    if (image_url !== undefined) {
        await Products.patchImageUrl(product_id, image_url, currentDate);
    }

    if (images !== undefined) {
        await Products.patchImages(product_id, images, currentDate);
    }

    if (weight !== undefined) {
        if (weight < 0) {
            return res.status(400).json({
                success: false,
                info: "Invalid weight"
            });
        }

        await Products.patchWeight(product_id, weight, currentDate);
    }

    if (unit !== undefined) {
        if (!allowedUnit.includes(unit)) {
            return res.status(400).json({
                success: false,
                info: "Invalid unit"
            });
        }

        await Products.patchUnit(product_id, unit, currentDate);
    }

    if (is_active !== undefined) {
        if (typeof(is_active) !== "boolean") {
            return res.status(400).json({
                success: false,
                info: "Invalid is_active"
            });
        }

        await Products.patchIsActive(product_id, is_active, currentDate);
    }

    if (is_featured !== undefined) {
        if (typeof(is_featured) !== "boolean") {
            return res.status(400).json({
                success: false,
                info: "Invalid is_featured"
            });
        }

        await Products.patchIsFeatured(product_id, is_featured, currentDate);
    }

    res.status(200).json({
        success: true,
        info: "Product was updated"
    });

});

// Delete product
const deleteProduct = asyncHandler (async (req, res) => {

    const product_id = +req.params.product_id;

    const product = await Products.getProduct(product_id);

    if (!product) {
        return res.status(404).json({
            success: false,
            info: "Product with such ID is not found"
        });
    }

    await Products.deleteProduct(product_id);
    res.status(200).json({
        success: true,
        info: "Product was deleted"
    });

});

module.exports = {
    getProductsWithFilter,
    getProduct,
    checkNameIsTaken,
    postProduct,
    patchProductField,
    deleteProduct
};