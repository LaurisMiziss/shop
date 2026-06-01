const express = require('express');
const router = express.Router();
const loginLimiter = require('../middleware/loginLimiter');
const requireAuth = require('../middleware/requireAuth');
const requireAdmin = require('../middleware/requireAdmin');
const validateParams = require('../middleware/validateParams');
const userController = require('../controllers/userController');

// Auth
router.post('/register', loginLimiter, userController.register);
router.post('/login', loginLimiter, userController.login);
router.post('/login_by_token', requireAuth, loginLimiter, userController.loginByToken);

// Guest validation
router.get('/check-guest', userController.validateField);

// Logged-in user
router.get('/check', requireAuth, userController.validateField);
router.patch('/', requireAuth, userController.patchUserField);
router.delete('/', requireAuth, userController.deleteUser);
router.post('/verify', requireAuth, userController.verifyAction);
router.patch('/settings', requireAuth, userController.patchSetting);
router.patch('/change-password', requireAuth, userController.patchPassword);
router.get('/get-settings', requireAuth, userController.getUserSettings);

// Admin
router.patch(
  '/admin/:target_user_id',
  requireAuth,
  requireAdmin,
  validateParams('target_user_id'),
  userController.patchRole
);
router.get('/admin',
  requireAuth,
  requireAdmin,
  userController.getAllUsers
);
router.get('/admin/:user_id',
  requireAuth,
  requireAdmin,
  userController.getUser
);

module.exports = router;