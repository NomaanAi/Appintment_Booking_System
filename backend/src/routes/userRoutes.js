const express = require('express');
const router = express.Router();
const { getMe, updateMe, changePassword } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { validate, schemas } = require('../middleware/validationMiddleware');

router.use(protect); // All routes are protected

router.get('/me', getMe);
router.put('/me', validate(schemas.updateProfile), updateMe);
router.put('/change-password', validate(schemas.changePassword), changePassword);

module.exports = router;
