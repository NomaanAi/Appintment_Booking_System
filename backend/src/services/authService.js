const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { AppError } = require('../middleware/errorMiddleware');

const generateAccessToken = (user) => {
    return jwt.sign({ id: user._id, role: user.role, name: user.name }, process.env.JWT_SECRET, {
        expiresIn: '15m' // Short lived
    });
};

const generateRefreshToken = async (user) => {
    const token = crypto.randomBytes(40).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await RefreshToken.create({
        token,
        user: user._id,
        expiresAt
    });

    return token;
};

exports.register = async (userData) => {
    const { name, email, password, role } = userData;

    const userExists = await User.findOne({ email });
    if (userExists) {
        throw new AppError('User already exists', 400);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: role || 'user'
    });

    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);

    return {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        accessToken,
        refreshToken
    };
};

exports.login = async (loginData) => {
    const { email, password } = loginData;

    const user = await User.findOne({ email }).select('+password');

    if (user && (await bcrypt.compare(password, user.password))) {
        const accessToken = generateAccessToken(user);
        const refreshToken = await generateRefreshToken(user);

        return {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            accessToken,
            refreshToken
        };
    } else {
        throw new AppError('Invalid email or password', 401);
    }
};

exports.refresh = async (token) => {
    if (!token) throw new AppError('Token is required', 400);

    const rToken = await RefreshToken.findOne({ token });

    if (!rToken || rToken.revoked || Date.now() >= rToken.expiresAt) {
        throw new AppError('Invalid or expired refresh token', 403);
    }

    const user = await User.findById(rToken.user);
    if (!user) throw new AppError('User not found', 404);

    // Rotate token
    rToken.revoked = true;
    await rToken.save();

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = await generateRefreshToken(user);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

exports.revokeToken = async (token) => {
    await RefreshToken.findOneAndUpdate({ token }, { revoked: true });
};

exports.getUserById = async (id) => {
    return await User.findById(id);
};

exports.updateProfile = async (userId, updateData) => {
    const user = await User.findById(userId);

    if (!user) {
        throw new AppError('User not found', 404);
    }

    if (updateData.email && updateData.email !== user.email) {
        const emailExists = await User.findOne({ email: updateData.email });
        if (emailExists) {
            throw new AppError('Email already in use', 400);
        }
    }

    user.name = updateData.name || user.name;
    user.email = updateData.email || user.email;

    const updatedUser = await user.save();

    // Changing profile doesn't necessarily need new tokens immediately, but we return updated info
    return {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role
    };
};

exports.changePassword = async (userId, oldPassword, newPassword) => {
    const user = await User.findById(userId).select('+password');
    if (!user) throw new AppError('User not found', 404);

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) throw new AppError('Invalid current password', 401);

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    // Optionally revoke all sessions here for security
    await RefreshToken.updateMany({ user: userId }, { revoked: true });

    return { message: 'Password updated successfully' };
};
