const Staff = require('../models/Staff');
const User = require('../models/User');
const { AppError } = require('../middleware/errorMiddleware');

exports.getAllStaff = async () => {
    return await Staff.find().populate('user', 'name email');
};

exports.createStaff = async (data) => {
    const user = await User.findById(data.userId);
    if (!user) {
        throw new AppError('User not found', 404);
    }

    // Ensure user has 'staff' role or 'admin'
    // In a real app we might auto-update the user role here
    if (user.role === 'user') {
        user.role = 'staff';
        await user.save();
    }

    const staff = await Staff.create({
        user: data.userId,
        specialties: data.specialties,
        availability: data.availability
    });
    return staff;
};

exports.updateStaff = async (id, data) => {
    const staff = await Staff.findByIdAndUpdate(id, data, { new: true });
    return staff;
};

exports.deleteStaff = async (id) => {
    // Soft delete or hard delete? Let's do hard for now
    await Staff.findByIdAndDelete(id);
};
