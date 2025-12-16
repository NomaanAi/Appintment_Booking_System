const Business = require('../models/Business');

exports.getSettings = async () => {
    let settings = await Business.findOne();
    if (!settings) {
        // Create default if missing
        settings = await Business.create({ name: 'Default Business' });
    }
    return settings;
};

exports.updateSettings = async (data) => {
    let settings = await Business.findOne();
    if (!settings) {
        settings = await Business.create(data);
    } else {
        Object.assign(settings, data);
        await settings.save();
    }
    return settings;
};
