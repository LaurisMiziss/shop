const filter = (model, category_id, sort, sort_type, price_min, price_max, is_featured, offset) => {
    
    const allowedModel = ["products", "cart_items"];
    const allowedSort = model === "products" ? ["name", "price", "stock"] : ["name", "price", "stock", "added_at"];
    const allowedSortType = ["ASC", "DESC"];

    if (
        !allowedModel.includes(model) || !allowedSort.includes(sort) || !allowedSortType.includes(sort_type) || 
        (price_min < 0 || price_max < 0 || price_max < price_min || (Number.isNaN(price_min) || Number.isNaN(price_max))) || 
        typeof(is_featured) !== "boolean" || !Number.isInteger(offset)
    ) {
        return "Error";
    }

    let query;

    if (model === "products") {
        query = 
            `SELECT id, name, price, stock, category_id, image_url, is_active, is_featured 
            FROM products 
            WHERE name ILIKE '%' || $1 || '%' 
            AND price BETWEEN $2 AND $3`;

    } else {
        query =
            `SELECT 
            ci.*, name, price, stock, category_id, image_url, is_active, is_featured
            FROM cart_items AS ci
            JOIN products AS pr
            ON pr.id = ci.product_id
            WHERE user_id = $1 
            AND name ILIKE '%' || $2 || '%' 
            AND price BETWEEN $3 AND $4`;

    }

    if (category_id !== undefined) {
        query += ` AND category_id = ${category_id}`
    }

    if (is_featured !== false) {
        query += ` AND is_featured = true`
    }

    query += ` ORDER BY ${sort} ${sort_type}`

    if (model === "products") {
        query += ` LIMIT $4 OFFSET $5;`
    } else {
        query += ` LIMIT $5 OFFSET $6;`
    }

    return query;

};

module.exports = filter;