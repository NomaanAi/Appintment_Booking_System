const express = require('express');
const router = express.Router();
const { getAllStaff, createStaff, updateStaff, deleteStaff, updateMyAvailability } = require('../controllers/staffController');
const { protect, admin, authorize } = require('../middleware/authMiddleware');

router.get('/', getAllStaff);
router.put('/availability', protect, authorize('staff', 'admin'), updateMyAvailability); // Staff or Admin can update
router.post('/', protect, admin, createStaff);
router.put('/:id', protect, admin, updateStaff);
router.delete('/:id', protect, admin, deleteStaff);

module.exports = router;
