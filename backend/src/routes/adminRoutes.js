const express = require('express');
const router = express.Router();
const { getStats, getSettings, updateSettings } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.use(protect);
router.use(admin);

router.get('/stats', getStats);
router.get('/settings', getSettings);
router.put('/settings', updateSettings);

module.exports = router;
