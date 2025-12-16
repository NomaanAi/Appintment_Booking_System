const userService = require('../services/userService');
const authService = require('../services/authService'); // Reuse getById
const { catchAsync } = require('../middleware/errorMiddleware');

exports.getMe = catchAsync(async (req, res, next) => {
    const user = await authService.getUserById(req.user.id);
    res.status(200).json({
        status: 'success',
        data: user
    });
});

exports.updateMe = catchAsync(async (req, res, next) => {
    const user = await userService.updateProfile(req.user.id, req.body);
    res.status(200).json({
        status: 'success',
        data: user,
        message: 'Profile updated successfully'
    });
});

exports.changePassword = catchAsync(async (req, res, next) => {
    await userService.changePassword(req.user.id, req.body.oldPassword, req.body.newPassword);
    res.status(200).json({
        status: 'success',
        message: 'Password changed successfully'
    });
});
