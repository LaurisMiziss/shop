const Categories = require('../models/Categories');
const asyncHandler = require('../utils/asyncHandler');
const categoriesDuplicateCheck = require('../utils/categoriesDuplicateCheck');

// Get all categories and count how many products are in each category
const getAllCategories = asyncHandler (async (req, res) => {
    
    const categories = await Categories.getAllCategories();

    res.status(200).json({
        success: true,
        data: categories,
        info: 'Retrieved categories'
    });

});

// Get all active categories and count how many products are in each category
const getAllActiveCategories = asyncHandler (async (req, res) => {
    
    const categories = await Categories.getAllActiveCategories();

    res.status(200).json({
        success: true,
        data: categories,
        info: 'Retrieved categories'
    });

});

// Get all products of this category
const getProductsOfCategory = asyncHandler (async (req, res) => {

    const category_id = +req.params.category_id;
    const limit = +req.query.limit;
    const offset = +req.query.offset;

    if (!Number.isInteger(offset)) {
        res.status(400).json({
            success: false,
            info: "Invalid offset"
        });
    }

    const category = await Categories.getCategory(category_id);

    if (category === undefined || category.is_active === false) {
        return res.status(404).json({
            success: false,
            info: "Category not found"
        });
    }

    const categoryProducts = await Categories.getProductsOfCategory(category_id, limit, offset);

    res.status(200).json({
        success: true,
        data: categoryProducts,
        info: "Retrieved category products"
    });

});

// Admin role required to use below controllers
// Check if category name or display_order are taken
const checkCategoryNameOrOrder = asyncHandler (async (req, res) => {

    const name = req.query.name;
    const display_order = +req.query.display_order || undefined;

    const message = await categoriesDuplicateCheck(name, display_order);

    if (message !== "Duplicates are not found") {
        return res.status(409).json({
            success: false,
            info: message
        });
    }

    res.status(200).json({
        success: true,
        info: "Duplicates are not found"
    });

});

// Get info about category
const getCategory = asyncHandler (async (req, res) => {

    const category_id = +req.params.category_id;

    const category = await Categories.getCategory(category_id);

    if (category === undefined) {
        return res.status(404).json({
            success: false,
            info: "Category not found"
        });
    }

    res.status(200).json({
        success: true,
        data: category,
        info: "Retrieved category"
    });

});

// Post a new category, name, display_order and is_active can't be undefined
const postCategory = asyncHandler (async (req, res) => {

    const { name, description, image_url, display_order, is_active } = req.body;

    if (!name || typeof(is_active) !== "boolean") {
        return res.status(400).json({
            success: false,
            info: "Invalid name or is_active"
        });
    }

    const message = await categoriesDuplicateCheck(name, display_order);

    if (message !== "Duplicates are not found") {
        return res.status(409).json({
            success: false,
            info: message
        });
    }

    await Categories.postCategory(name, description, image_url, display_order, is_active);

    res.status(201).json({
        success: true,
        info: "New category was created"
    });

});

// Patch category field: name, description, image_url, display_order or is_active
const patchCategoryField = asyncHandler (async (req, res) => {

    const category_id = +req.params.category_id;
    const { name, description, image_url, display_order, is_active } = req.body;

    const category = await Categories.getCategory(category_id);

    if (category === undefined) {
        return res.status(404).json({
            success: false,
            info: "Category not found"
        });
    }

    if (name !== undefined) {
        const message = await categoriesDuplicateCheck(name, undefined);

        if (message !== "Duplicates are not found") {
            return res.status(409).json({
                success: false,
                info: message
            });
        }

        await Categories.patchName(category_id, name);
    }

    if (description !== undefined) {
        await Categories.patchDescription(category_id, description);
    }

    if (image_url !== undefined) {
        await Categories.patchImageUrl(category_id, image_url);
    }
    
    if (display_order !== undefined) {
        const order = +display_order;

        if (!Number.isInteger(order) || order <= 0) {
            return res.status(400).json({
                success: false,
                info: "Invalid display_order"
            });
        }

        const message = await categoriesDuplicateCheck(undefined, order);

        if (message !== "Duplicates are not found") {
            return res.status(409).json({
                success: false,
                info: message
            });
        }

        await Categories.patchDisplayOrder(category_id, order);
    }
        
    if (is_active !== undefined) {
        if (typeof(is_active) !== "boolean") {
            return res.status(400).json({
                success: false,
                info: "Invalid is_active"
            });
        }

        await Categories.patchIsActive(category_id, is_active);
    }
    
    res.status(200).json({
        success: true,
        info: "Category was updated"
    });

});

// Delete category
const deleteCategory = asyncHandler (async (req, res) => {

    const category_id  = +req.params.category_id;

    const category = await Categories.getCategory(category_id);
    
    if (category === undefined) {
        return res.status(404).json({
            success: false,
            info: "Category not found"
        });
    }

    await Categories.deleteCategory(category_id);

    res.status(200).json({
        success: true,
        info: "Category was deleted"
    });

});

module.exports = {
    getAllCategories,
    getAllActiveCategories,
    getProductsOfCategory,
    checkCategoryNameOrOrder,
    getCategory,
    postCategory,
    patchCategoryField,
    deleteCategory
};