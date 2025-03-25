const { model } = require('mongoose');
const CustomError = require('../errors');
const { isTokenValid } = require('../utils');

const authenticatedUser = async (req, res, next) => {
    const token = req.signedCookies.token;
    if (!token) {
        throw new CustomError.UnauthenticatedError('Authentication Invalid');
    }

    try {
        const { username, userId, role } = isTokenValid({ token });
        req.user = { username, userId, role };
        next();
    } catch (error) {
        throw CustomError.UnauthenticatedError('Authentication Invalid');
    }
};

const authorizePermissions = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new CustomError.UnauthorizedError('Unauthorized access to this route');
        }
        next();
    };
};

module.exports = {
    authenticatedUser,
    authorizePermissions,
};
