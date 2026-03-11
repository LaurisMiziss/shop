const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');
const requireAdmin = require('../middleware/requireAdmin');
const validateParams = require('../middleware/validateParams');
const validateQuery = require('../middleware/validateQuery');
const ordersController = require('../controllers/ordersController');

// Admin routes
router.patch('/admin/:order_id',
    requireAuth,
    requireAdmin,
    validateParams('order_id'),
    ordersController.patchOrder
);

// Customer routes
router.delete('/:order_id',
    requireAuth,
    validateParams('order_id'),
    ordersController.deleteOrder
);
router.patch('/:order_id',
    requireAuth,
    validateParams('order_id'),
    ordersController.patchCustomerNotes
);
router.post('/',
    requireAuth,
    ordersController.postOrder
);
router.get('/', 
    requireAuth,
    validateQuery('limit_num'),
    ordersController.getOrders
);

module.exports = router;