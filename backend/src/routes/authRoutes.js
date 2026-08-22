const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validateRegister, validateLogin, validate } = require('../middleware/validation');

router.post('/register', validateRegister, validate, authController.register);
router.post('/login', validateLogin, validate, authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.get('/me', protect, authController.getMe);
router.put('/update-profile', protect, authController.updateProfile);

module.exports = router;  