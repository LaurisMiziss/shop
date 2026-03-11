const pool = require('../config/db');

const getProduct = async (product_id) => {
    const result = await pool.query(
        `SELECT * FROM products
        WHERE id = $1;`,
        [product_id]
    );

    return result.rows[0];
};

const searchQuery = async (query, name, price_min = 0, price_max = 10000, limit = 10, offset = 0) => {
    const result = await pool.query(
        `${query}`,
        [name, price_min, price_max, limit, offset]
    )

    return result.rows;
};

const checkNameIsTaken = async (name) => {
    const result = await pool.query(
        `SELECT * FROM products
        WHERE name ILIKE $1;`,
        [name]
    );

    return result.rows;
};

const postProduct = async (
    name, description = null, price, category_id, stock = 0, sku = null, 
    image_url = null, images = null, weight = 0,
    unit = null, is_active = false, is_featured = false, updated_at = new Date()
) => {
    await pool.query(
        `INSERT INTO products (name, description, price, category_id, stock, sku, 
        image_url, images, weight, unit, is_active, is_featured, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13);`,
        [
            name, description, price, category_id, stock, sku, 
            image_url, images, weight, unit, is_active, is_featured, updated_at
        ]
    );
};

const patchName = async (product_id, name, updated_at) => {
    await pool.query(
        `UPDATE products SET name = $2, updated_at = $3
        WHERE id = $1;`,
        [product_id, name, updated_at]
    );
};

const patchDescription = async (product_id, description, updated_at) => {
    await pool.query(
        `UPDATE products SET description = $2, updated_at = $3
        WHERE id = $1;`,
        [product_id, description, updated_at]
    );
};

const patchPrice = async (product_id, price, updated_at) => {
    await pool.query(
        `UPDATE products SET price = $2, updated_at = $3
        WHERE id = $1;`,
        [product_id, price, updated_at]
    );
};

const patchCategory = async (product_id, category_id, updated_at) => {
    await pool.query(
        `UPDATE products SET category_id = $2, updated_at = $3
        WHERE id = $1;`,
        [product_id, category_id, updated_at]
    );
};

const patchStock = async (product_id, stock, updated_at) => {
    await pool.query(
        `UPDATE products SET stock = $2, updated_at = $3
        WHERE id = $1;`,
        [product_id, stock, updated_at]
    );
};

const patchSku = async (product_id, sku, updated_at) => {
    await pool.query(
        `UPDATE products SET sku = $2, updated_at = $3
        WHERE id = $1;`,
        [product_id, sku, updated_at]
    );
};

const patchImageUrl = async (product_id, image_url, updated_at) => {
    await pool.query(
        `UPDATE products SET image_url = $2, updated_at = $3
        WHERE id = $1;`,
        [product_id, image_url, updated_at]
    );
};

const patchImages = async (product_id, images, updated_at) => {
    await pool.query(
        `UPDATE products SET images = $2, updated_at = $3
        WHERE id = $1;`,
        [product_id, images, updated_at]
    );
};

const patchWeight = async (product_id, weight, updated_at) => {
    await pool.query(
        `UPDATE products SET weight = $2, updated_at = $3
        WHERE id = $1;`,
        [product_id, weight, updated_at]
    );
};

const patchUnit = async (product_id, unit, updated_at) => {
    await pool.query(
        `UPDATE products SET unit = $2, updated_at = $3
        WHERE id = $1;`,
        [product_id, unit, updated_at]
    );
};

const patchIsActive = async(product_id, is_active, updated_at) => {
    await pool.query(
        `UPDATE products SET is_active = $2, updated_at = $3
        WHERE id = $1;`,
        [product_id, is_active, updated_at]
    );
};

const patchIsFeatured = async (product_id, is_featured, updated_at) => {
    await pool.query(
        `UPDATE products SET is_featured = $2, updated_at = $3
        WHERE id = $1;`,
        [product_id, is_featured, updated_at]
    );
};

const deleteProduct = async (product_id) => {
    await pool.query(
        `DELETE FROM products
        WHERE id = $1;`,
        [product_id]
    );
};

module.exports = {
    getProduct,
    searchQuery,
    checkNameIsTaken,
    postProduct,
    patchName,
    patchDescription,
    patchPrice,
    patchCategory,
    patchStock,
    patchSku,
    patchImageUrl,
    patchImages,
    patchWeight,
    patchUnit,
    patchIsActive,
    patchIsFeatured,
    deleteProduct
};