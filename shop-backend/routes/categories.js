const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');
const requireAdmin = require('../middleware/requireAdmin');
const validateParams = require('../middleware/validateParams');
const validateQuery = require('../middleware/validateQuery');
const validateBody = require('../middleware/validateBody');
const categoriesController = require('../controllers/categoriesController');

// Admin routes
router.get('/admin/check',
    requireAuth,
    requireAdmin,
    validateQuery('display_order'),
    categoriesController.checkCategoryNameOrOrder
);
router.post('/admin',
    requireAuth,
    requireAdmin,
    validateBody('display_order'),
    categoriesController.postCategory
);
router.get('/admin/:category_id',
    requireAuth,
    requireAdmin,
    validateParams('category_id'),
    categoriesController.getCategory
);
router.patch('/admin/:category_id',
    requireAuth,
    requireAdmin,
    validateParams('category_id'),
    categoriesController.patchCategoryField
);
router.delete('/admin/:category_id',
    requireAuth,
    requireAdmin,
    validateParams('category_id'),
    categoriesController.deleteCategory
);

// Guest/Customer routes
router.get('/', categoriesController.getAllCategories);
router.get('/:category_id',
    validateParams('category_id'),
    validateQuery('limit'),
    categoriesController.getProductsOfCategory
);

module.exports = router;