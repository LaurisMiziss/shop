const pool = require('../config/db');

const searchQuery = async (query, user_id, name, price_min = 0, price_max = 10000, limit = 10, offset = 0) => {
    const result = await pool.query(
        `${query}`,
        [user_id, name, price_min, price_max, limit, offset]
    );

    return result.rows;
};

const checkIfItemIsAdded = async (user_id, product_id) => {
    const result = await pool.query(
        `SELECT * FROM cart_items
        WHERE user_id = $1 AND product_id = $2;`,
        [user_id, product_id]
    );

    return result.rows[0];
};

const postItem = async (user_id, product_id, quantity) => {
    await pool.query(
        `INSERT INTO cart_items (user_id, product_id, quantity, added_at)
        VALUES ($1, $2, $3, CURRENT_TIMESTAMP)`,
        [user_id, product_id, quantity]
    );
};

const updateItemQuantity = async (user_id, product_id, quantity) => {
    await pool.query(
        `UPDATE cart_items SET quantity = $3
        WHERE user_id = $1 AND product_id = $2;`,
        [user_id, product_id, quantity]
    );
};

const deleteItem = async (user_id, product_id) => {
    await pool.query(
        `DELETE FROM cart_items
        WHERE user_id = $1 AND product_id = $2;`,
        [user_id, product_id]
    );
};

module.exports = {
    searchQuery,
    checkIfItemIsAdded,
    postItem,
    updateItemQuantity,
    deleteItem
};