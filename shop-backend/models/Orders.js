const pool = require('../config/db');

const getOrder = async (order_id) => {
    const result = await pool.query(
        `SELECT * FROM orders
        WHERE id = $1;`,
        [order_id]
    );

    return result.rows[0];
};

const getOrdersAndItems = async (user_id, limit, offset) => {
    const result = await pool.query(
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
            ON oi.order_id = o.id

        WHERE o.user_id = $1

        GROUP BY o.id
        ORDER BY o.created_at DESC
        LIMIT $2 OFFSET $3;
        `,
        [user_id, limit, offset]
    );

    return result.rows;
};

const patchOrderStatus = async (order_id, status, updated_at) => {
    await pool.query(
        `UPDATE orders SET status = $2, updated_at = $3
        WHERE id = $1;`,
        [order_id, status, updated_at]
    );
};

const patchPaymentStatus = async (order_id, payment_status, updated_at) => {
    await pool.query(
        `UPDATE orders SET payment_status = $2, updated_at = $3
        WHERE id = $1;`,
        [order_id, payment_status, updated_at]
    );
};

const patchCustomerNotes = async (order_id, customer_notes, updated_at) => {
    await pool.query(
        `UPDATE orders SET customer_notes = $2, updated_at = $3
        WHERE id = $1;`,
        [order_id, customer_notes, updated_at]
    );
};

const patchAdminNotes = async (order_id, admin_notes, updated_at) => {
    await pool.query(
        `UPDATE orders SET admin_notes = $2, updated_at = $3
        WHERE id = $1;`,
        [order_id, admin_notes, updated_at]
    );
};

const deleteOrder = async (order_id) => {
    await pool.query(
        `DELETE FROM orders
        WHERE id = $1;`,
        [order_id]
    );
};

module.exports = {
    getOrder,
    getOrdersAndItems,
    patchCustomerNotes,
    patchOrderStatus,
    patchPaymentStatus,
    patchAdminNotes,
    deleteOrder
};