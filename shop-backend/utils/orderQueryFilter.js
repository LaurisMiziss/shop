const orderQueryFilter = (is_admin, limit, offset, order_id = undefined) => {

    if (!is_admin) return "Error";

    let query = 
        `SELECT
            o.id,
            o.user_id,
            o.total_amount,
            o.status,
            o.created_at,
            o.customer_notes,
            COUNT(*) OVER() AS total,


            COALESCE(
                json_agg(
                    json_build_object(
                        'product_id', oi.product_id,
                        'product_name', oi.product_name,
                        'product_price', oi.product_price,
                        'quantity', oi.quantity,
                        'subtotal', oi.subtotal
                    )
                ) FILTER (WHERE oi.id IS NOT NULL),
                '[]'
            ) AS items

        FROM orders o
        LEFT JOIN order_items oi
            ON oi.order_id = o.id`;

    if (order_id) {
        query += ` WHERE oi.order_id = ${order_id}`
    }

    query +=
        ` GROUP BY o.id
        ORDER BY o.created_at DESC
        LIMIT $1 OFFSET $2;`;
    
    return query

};

module.exports = orderQueryFilter;