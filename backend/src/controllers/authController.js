const authService = require('../services/authService');
const { catchAsync } = require('../middleware/errorMiddleware');

exports.register = catchAsync(async (req, res, next) => {
    const data = await authService.register(req.body);
    res.status(201).json({ status: 'success', data });
});

exports.login = catchAsync(async (req, res, next) => {
    const data = await authService.login(req.body);
    res.status(200).json({ status: 'success', data });
});

exports.refreshToken = catchAsync(async (req, res, next) => {
    const { refreshToken } = req.body;
    const data = await authService.refresh(refreshToken);
    res.status(200).json({ status: 'success', data });
});

exports.revokeToken = catchAsync(async (req, res, next) => {
    const { refreshToken } = req.body;
    await authService.revokeToken(refreshToken);
    res.status(200).json({ status: 'success', message: 'Token revoked' });
});

exports.getMe = catchAsync(async (req, res, next) => {
    const user = await authService.getUserById(req.user.id);
    res.status(200).json({ status: 'success', data: user });
});

exports.updateProfile = catchAsync(async (req, res, next) => {
    const updatedUser = await authService.updateProfile(req.user.id, req.body);
    res.status(200).json({ status: 'success', data: updatedUser });
});

exports.changePassword = catchAsync(async (req, res, next) => {
    await authService.changePassword(req.user.id, req.body.oldPassword, req.body.newPassword);
    res.status(200).json({ status: 'success', message: 'Password updated successfully' });
});
