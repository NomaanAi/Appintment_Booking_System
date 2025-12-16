const adminService = require('../services/adminService');
const businessService = require('../services/businessService');
const { catchAsync } = require('../middleware/errorMiddleware');

exports.getStats = catchAsync(async (req, res, next) => {
    const stats = await adminService.getDashboardStats();
    res.status(200).json({
        status: 'success',
        data: stats
    });
});

exports.getSettings = catchAsync(async (req, res, next) => {
    const settings = await businessService.getSettings();
    res.status(200).json({
        status: 'success',
        data: settings
    });
});

exports.updateSettings = catchAsync(async (req, res, next) => {
    const settings = await businessService.updateSettings(req.body);
    res.status(200).json({
        status: 'success',
        data: settings
    });
});
