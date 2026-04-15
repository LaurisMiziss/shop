const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');
const requireAdmin = require('../middleware/requireAdmin');
const validateParams = require('../middleware/validateParams');
const validateQuery = require('../middleware/validateQuery');
const validateBody = require('../middleware/validateBody');
const productsController = require('../controllers/productsController');

// Admin routes
router.get('/admin/check',
    requireAuth,
    requireAdmin,
    productsController.checkNameIsTaken
);
router.post('/admin',
    requireAuth,
    requireAdmin,
    validateBody('category_id'),
    productsController.postProduct
);
router.patch('/admin/:product_id',
    requireAuth,
    requireAdmin,
    validateParams('product_id'),
    validateQuery('category_id'),
    productsController.patchProductField
);
router.delete('/admin/:product_id',
    requireAuth,
    requireAdmin,
    validateParams('product_id'),
    productsController.deleteProduct
);
router.get ('/admin',
    requireAuth,
    requireAdmin,
    validateQuery('category_id'),
    validateQuery('limit'),
    productsController.getAdminProductsWithFilter
);

// Guest routes
router.get ('/',
    validateQuery('category_id'),
    validateQuery('limit'),
    productsController.getProductsWithFilter
);
router.get('/:product_id',
    validateParams('product_id'),
    productsController.getProduct
);

module.exports = router;