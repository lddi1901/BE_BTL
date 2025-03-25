const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const {
    createTokenUser,
    attachCookiesToResponse,
    checkPermissions
} = require('../utils');


const getAllUsers = async (req, res) => {

    const users = await User.find({ role: { $in: ['employee', 'reader'] } }).select('-password');

    res.status(StatusCodes.OK).json({ users });

};

const getSingleUser = async (req, res) => {
    const user = await User.findOne({ _id: req.params.id }).select('-password');

    if (!user) {
        throw new CustomError.NotFoundError(`No user with id: ${req.params.id}`);
    }

    checkPermissions(req.user, user._id);
    res.status(StatusCodes.OK).json({ user });
};

const showCurrentUser = async (req, res) => {
    const user = await User.findById(req.user.userId).select('-_id -password');
    res.status(StatusCodes.OK).json({ user });
};

const updateUser = async (req, res) => {
    const { email, username, firstname, lastname, birthday, position, gender, address, phoneNumber } = req.body;

    const user = await User.findById(req.user.userId).select('-password');
    if (email) {
        user.email = email;
    }

    if (username) {
        user.username = username;
    }

    user.firstname = firstname;
    user.lastname = lastname;
    user.birthday = birthday;
    user.gender = gender;
    user.address = address;
    user.position = position;
    user.phoneNumber = phoneNumber;

    await user.save();

    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({ res, user: tokenUser });
    res.status(StatusCodes.OK).json({ user: user });
};

const updateUserPassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
        throw new CustomError.BadRequestError('Please provide both values');
    }
    const user = await User.findById(req.user.userId);

    const isPasswordCorrect = await user.comparePassword(oldPassword);

    if (!isPasswordCorrect) {
        throw new CustomError.UnauthenticatedError('Invalid Credentials');
    }
    user.password = newPassword;
    await user.save();
    res.status(StatusCodes.OK).json({ msg: 'Success! Password Updated.' });
};

const editSingleUser = async (req, res) => {
    const { role } = req.body;
    const user = await User.findOne({ _id: req.params.id }).select('-password');

    if (!user) {
        throw new CustomError.NotFoundError(`No user with id: ${req.params.id}`);
    }

    checkPermissions(req.user, user._id);
    user.role = role;
    await user.save();
    res.status(StatusCodes.OK).json({ user });
}

module.exports = {
    getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword,
    editSingleUser,
};