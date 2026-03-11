const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');
const requireAdmin = require('../middleware/requireAdmin');
const validateParams = require('../middleware/validateParams');
const userController = require('../controllers/userController');

// Auth
router.post('/register', userController.register);
router.post('/login', userController.login);

// Guest validation
router.get('/check', userController.validateField);

// Logged-in user
router.patch('/', requireAuth, userController.patchUserField);
router.delete('/', requireAuth, userController.deleteUser);
router.post('/verify', requireAuth, userController.verifyAction);

// Admin
router.patch(
  '/admin/:target_user_id',
  requireAuth,
  requireAdmin,
  validateParams('target_user_id'),
  userController.patchRole
);

module.exports = router;