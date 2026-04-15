const Orders = require('../models/Orders');
const asyncHandler = require("../utils/asyncHandler");
const pool = require('../config/db');

// Get orders and each order's details
const getOrders = asyncHandler ( async (req, res) => {

    const limit = Number(req.query.limit) || 10;
    const offset = Number(req.query.offset) || 0;

    if (!Number.isInteger(offset) || !Number.isInteger(limit)) {
        res.status(400).json({
            success: false,
            info: "Invalid offset or limit"
        });
    }

    const orders = await Orders.getOrdersAndItems(req.user.id, limit, offset);
    
    res.status(200).json({ 
        success: true, 
        data: orders, 
        info: "Retrieved orders and details" 
    });

});

// Post new order using transaction, cart, shipping_name, shipping_address_line1, shipping_address_line2,
// shipping_city, shipping_postal_code, shipping_country can't be undefined
const postOrder = asyncHandler(async (req, res) => {

    const client = await pool.connect();

    try {

        await client.query("BEGIN");

        const user_id = req.user.id;
        const {
            cart, shipping_name, shipping_phone, shipping_address_line1,
            shipping_address_line2, shipping_city, shipping_postal_code, shipping_country,
            payment_method, customer_notes
        } = req.body;

        if (!cart || !shipping_name || !shipping_address_line1 || !shipping_city || !shipping_postal_code || !shipping_country) {
            throw new Error("Missing required field(s)");
        }

        const checkFields = cart.find(product => (product.product_id === undefined || product.quantity === undefined) || !Number.isInteger(product.id));

        if (checkFields) {
            throw new Error("Wrong format");
        }

        let total_amount = 0;

        const checkedCart = [];

        for (const cartProduct of cart) {

            const { rows } = await client.query(
                "SELECT id, name, price, stock FROM products WHERE id = $1",
                [cartProduct.product_id]
            );

            const product = rows[0];

            if (product === undefined) {
                throw new Error("Product not found");
            }

            if (+product.stock < +cartProduct.quantity) {
                throw new Error("Not enough stock");
            }

            const subtotal = +product.price * +cartProduct.quantity;

            total_amount += subtotal;

            checkedCart.push({
                ...product,
                quantity: +cartProduct.quantity,
                subtotal
            });
        }

        const orderResult = await client.query(
            `INSERT INTO orders 
            (user_id, total_amount, shipping_name, shipping_phone, shipping_address_line1,
            shipping_address_line2, shipping_city, shipping_postal_code, shipping_country,
            payment_method, customer_notes)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
            RETURNING *`,
            [
                user_id, total_amount, shipping_name, shipping_phone, shipping_address_line1,
                shipping_address_line2, shipping_city, shipping_postal_code, shipping_country,
                payment_method, customer_notes
            ]
        );
        const order_id = orderResult.rows[0].id;

        for (const product of checkedCart) {

            await client.query(
                `INSERT INTO order_items
                (order_id, product_id, product_name, product_price, quantity, subtotal)
                VALUES ($1,$2,$3,$4,$5,$6)`,
                [
                    order_id,
                    product.id,
                    product.name,
                    product.price,
                    +product.quantity,
                    product.subtotal
                ]
            );

            const stockResult = await client.query(
                `UPDATE products
                 SET stock = stock - $1
                 WHERE id = $2
                 AND stock >= $1`,
                [+product.quantity, product.id]
            );

            if (stockResult.rowCount === 0) {
                throw new Error("Not enough stock");
            }
        }

        await client.query("COMMIT");

        res.status(201).json({
            success: true,
            data: order_id
        });

    } catch (err) {

        await client.query("ROLLBACK");
        throw err;

    } finally {

        client.release();

    }

});

// Patch user's note about order
const patchCustomerNotes = asyncHandler (async (req, res) => {

    const user_id = +req.user.id;
    const order_id = +req.params.order_id;
    const { customer_notes } = req.body;

    const order = await Orders.getOrder(order_id);

    if (order === undefined) {
        return res.status(404).json({
            success: false,
            info: "Order with such ID is not found"
        });
    }

    if (order.user_id !== user_id) {
        return res.status(403).json({
            success: false,
            info: "Forbidden"
        });
    }

    if (order.status === "delivered") {
        return res.status(400).json({
            success: false,
            info: "Order's status is delivered"
        });
    } else {
        await Orders.patchCustomerNotes(order_id, customer_notes, new Date());
        return res.status(200).json({
            success: true,
            info: "Customer's note was updated"
        });
    }

});

// Delete order, allowed only if order's status is delivered
const deleteOrder = asyncHandler (async (req, res) => {
    
    const user_id = +req.user.id;
    const order_id = +req.params.order_id;

    const order = await Orders.getOrder(order_id);

    if (order === undefined) {
        return res.status(404).json({
            success: false,
            info: "Order with such ID is not found"
        });
    }

    if (order.user_id !== user_id) {
        return res.status(403).json({
            success: false,
            info: "Forbidden"
        });
    }

    if (order.status !== "delivered" || order.status !== "cancelled") {
        return res.status(400).json({
            success: false, 
            info: "Order can't be deleted, if it's not delivered or cancelled"
        });
    } else {
        await Orders.deleteOrder(order_id);
        return res.status(200).json({
            success: true,
            info: "Order was deleted"
        });
    }

});

// Admin role required to use below controller(s)
// Available patch fields: status, payment_status, admin_notes
const patchOrder = async (req, res) => {

    const order_id = +req.params.order_id;
    const { status, payment_status, admin_notes } = req.body;

    const order = await Orders.getOrder(order_id);

    if (order === undefined) {
        return res.status(404).json({
            success: false,
            info: "Order with such ID is not found"
        });
    }

    if (status !== undefined) {
        const statuses = ["pending", "processing", "shipped", "delivered", "cancelled"];

        if (order.status === status || !statuses.includes(status)) {
            return res.status(400).json({
                success: false,
                info: "Order already has this status or was chosen wrong status" 
            });
        }
        
        await Orders.patchOrderStatus(order_id, status, new Date());
    }

    if (payment_status !== undefined) {
        const statuses = ["pending", "paid", "failed"];

        if (order.payment_status === payment_status || !statuses.includes(payment_status)) {
            return res.status(400).json({
                success: false,
                info: "Order already has this payment status or was chosen wrong payment status" 
            });
        }

        await Orders.patchPaymentStatus(order_id, payment_status, new Date());
    }

    if (admin_notes !== undefined) {
        if (order.status === "delivered") {
            return res.status(400).json({
                success: false,
                info: "Order's note can't be changed, because order is delivered"
            });
        }

        await Orders.patchAdminNotes(order_id, admin_notes, new Date());
    };

    res.status(200).json({
        success: true,
        info: "Order was updated"
    });

};

module.exports = {
    getOrders,
    postOrder,
    patchCustomerNotes,
    deleteOrder,
    patchOrder
};