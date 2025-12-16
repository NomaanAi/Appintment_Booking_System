const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { AppError } = require('../middleware/errorMiddleware');

exports.updateProfile = async (userId, data) => {
    const { name, email } = data;

    // Optional: Check if email is being changed and if it's already taken by another user
    if (email) {
        const existingUser = await User.findOne({ email });
        if (existingUser && existingUser._id.toString() !== userId) {
            throw new AppError('Email already in use', 400);
        }
    }

    const user = await User.findByIdAndUpdate(userId, { name, email }, {
        new: true,
        runValidators: true
    });

    return user;
};

exports.changePassword = async (userId, oldPassword, newPassword) => {
    const user = await User.findById(userId).select('+password');

    if (!await bcrypt.compare(oldPassword, user.password)) {
        throw new AppError('Incorrect current password', 401);
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    return true;
};
