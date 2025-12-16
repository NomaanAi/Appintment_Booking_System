const Staff = require('../models/Staff');
const User = require('../models/User');
const { AppError } = require('../middleware/errorMiddleware');

exports.getAllStaff = async (req, res, next) => {
    const staff = await Staff.find().populate('user', 'name email');
    res.status(200).json({ status: 'success', data: staff });
};

exports.createStaff = async (req, res, next) => {
    const { userId, specialties } = req.body;

    const user = await User.findById(userId);
    if (!user) throw new AppError('User not found', 404);

    // Check if already staff
    const existing = await Staff.findOne({ user: userId });
    if (existing) throw new AppError('User is already staff', 400);

    const staff = await Staff.create({
        user: userId,
        specialties,
        // Default availability could be copied from Business settings here
        availability: []
    });

    // Update user role
    user.role = 'staff';
    await user.save();

    res.status(201).json({ status: 'success', data: staff });
};

exports.updateStaff = async (req, res, next) => {
    const staff = await Staff.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ status: 'success', data: staff });
};

exports.deleteStaff = async (req, res, next) => {
    // Determine if we should delete the user or just downgrade role?
    // For now, just remove staff entry and downgrade role.
    const staff = await Staff.findById(req.params.id);
    if (!staff) throw new AppError('Staff not found', 404);

    const user = await User.findById(staff.user);
    if (user) {
        user.role = 'user';
        await user.save();
    }

    await staff.deleteOne();
    res.status(204).json({ status: 'success', data: null });
};

// Staff updating their own availability
exports.updateMyAvailability = async (req, res, next) => {
    const { availability } = req.body;

    // Find staff linked to current user
    const staff = await Staff.findOne({ user: req.user.id });
    if (!staff) throw new AppError('Staff profile not found', 404);

    staff.availability = availability;
    await staff.save();

    res.status(200).json({ status: 'success', data: staff });
};
