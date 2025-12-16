const Joi = require('joi');
const { AppError } = require('./errorMiddleware');

const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        const errorMessage = error.details.map((detail) => detail.message).join(', ');
        return next(new AppError(errorMessage, 400));
    }
    next();
};

const schemas = {
    register: Joi.object({
        name: Joi.string().min(3).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        role: Joi.string().valid('user', 'admin').optional()
    }),
    login: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    }),
    createAppointment: Joi.object({
        date: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required().messages({ 'string.pattern.base': 'Date must be YYYY-MM-DD' }),
        timeSlot: Joi.string().required() // valid('09:00 AM', ...) could be added if slots are strict
    }),
    updateStatus: Joi.object({
        status: Joi.string().valid('Approved', 'Rejected').required()
    }),
    updateProfile: Joi.object({
        name: Joi.string().min(3).required(),
        email: Joi.string().email().required()
    }),
    changePassword: Joi.object({
        oldPassword: Joi.string().required(),
        newPassword: Joi.string().min(6).required()
    })
};

module.exports = { validate, schemas };
