const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');
const validateParams = require('../middleware/validateParams');
const validateQuery = require('../middleware/validateQuery');
const cartsController = require('../controllers/cartsController');

// Customer routes
router.get('/',
    requireAuth,
    validateQuery('category_id'),
    validateQuery('limit'),
    cartsController.checkCart
);
router.post('/:product_id', 
    requireAuth,
    validateParams('product_id'),
    cartsController.postItem
);
router.patch('/:product_id', 
    requireAuth,
    validateParams('product_id'),
    cartsController.updateItemQuantity
);

router.delete('/delete', 
    requireAuth,
    cartsController.deleteOrderItems
);

router.delete('/:product_id', 
    requireAuth,
    validateParams('product_id'),
    cartsController.deleteItem
);

module.exports = router;