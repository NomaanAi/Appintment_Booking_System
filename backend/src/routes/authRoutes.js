const express = require('express');
const router = express.Router();
const { register, login, refreshToken, revokeToken, getMe, updateProfile, changePassword } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { validate, schemas } = require('../middleware/validationMiddleware');
const { authLimiter } = require('../middleware/securityMiddleware');

router.post('/register', authLimiter, validate(schemas.register), register);
router.post('/login', authLimiter, validate(schemas.login), login);
router.post('/refresh-token', refreshToken); // No auth header needed, just the refresh token body
router.post('/revoke-token', protect, revokeToken);

router.get('/me', protect, getMe);
router.put('/me', protect, validate(schemas.updateProfile), updateProfile);
router.put('/change-password', protect, validate(schemas.changePassword), changePassword);

module.exports = router;
