const pool = require('../config/db');

const getAllCategories = async () => {
    const result = await pool.query(
        `SELECT ct.*, COUNT('id') FROM categories as ct
        JOIN products as pr ON ct.id = pr.category_id
        WHERE ct.is_active = true
        GROUP BY ct.id
        ORDER BY display_order;`
    );

    return result.rows;
};

const getProductsOfCategory = async (category_id, limit, offset) => {
    const result = await pool.query(
        `SELECT 
            pr.id,
            pr.name,
            pr.description,
            pr.price,
            pr.category_id,
            pr.sku,
            pr.image_url 
		FROM categories as ct
        JOIN products as pr ON ct.id = pr.category_id
        WHERE (ct.id = $1 AND pr.is_active = true)
        ORDER BY pr.name ASC
		LIMIT $2 OFFSET $3;`,
        [category_id, limit, offset]
    );
    
    return result.rows;
};

const checkCategoryExists = async (name) => {
    const result = await pool.query(
        `SELECT * FROM categories 
        WHERE name ILIKE $1;`,
        [name]
    );

    return result.rows;
};

const checkDisplayOrderExists = async (display_order) => {
    const result = await pool.query(
        `SELECT * FROM categories 
        WHERE display_order = $1;`,
        [display_order]
    );

    return result.rows[0];
};

const getCategory = async (category_id) => {
    const result = await pool.query(
        `SELECT * FROM categories
        WHERE id = $1;`,
        [category_id]
    );

    return result.rows[0];
};

const postCategory = async (name, description, image_url, display_order, is_active) => {
    await pool.query(
        `INSERT INTO categories
        (name, description, image_url, display_order, is_active)
        VALUES ($1, $2, $3, $4, $5);`,
        [name, description, image_url, display_order, is_active]
    );
};

const patchName = async (category_id, name) => {
    await pool.query(
        `UPDATE categories SET name = $2
        WHERE id = $1;`,
        [category_id, name]
    );
};

const patchDescription = async (category_id, description) => {
    await pool.query(
        `UPDATE categories SET description = $2
        WHERE id = $1;`,
        [category_id, description]
    );
};

const patchImageUrl = async (categoryId, image_url) => {
    await pool.query(
        `UPDATE categories SET image_url = $2
        WHERE id = $1;`,
        [categoryId, image_url]
    );
};

const patchDisplayOrder = async (category_id, display_order) => {
    await pool.query(
        `UPDATE categories SET display_order = $2
        WHERE id = $1;`,
        [category_id, display_order]
    );
};

const patchIsActive = async (category_id, is_active) => {
    await pool.query(
        `UPDATE categories SET is_active = $2
        WHERE id = $1;`,
        [category_id, is_active]
    );
};

const deleteCategory = async (category_id) => {
    await pool.query(
        `DELETE FROM categories
        WHERE id = $1;`,
        [category_id]
    );
};

module.exports = {
    getAllCategories,
    getProductsOfCategory,
    checkCategoryExists,
    checkDisplayOrderExists,
    getCategory,
    postCategory,
    patchName,
    patchDescription,
    patchImageUrl,
    patchDisplayOrder,
    patchIsActive,
    deleteCategory
};