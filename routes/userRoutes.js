const express = require('express');
const router = express.Router();

const {
    authenticatedUser,
    authorizePermissions,
} = require('../middleware/authentication');

const {
    getAllUsers,
    showCurrentUser,
    updateUser,
    updateUserPassword,
    getSingleUser,
    editSingleUser,
} = require('../controllers/userController');

router.route('/').get(authenticatedUser, authorizePermissions('admin'), getAllUsers);

router.route('/showMe').get(authenticatedUser, showCurrentUser);
router.route('/updateUser').patch(authenticatedUser, updateUser);
router.route('/updateUserPassword').patch(authenticatedUser, updateUserPassword);

router.route('/:id')
    .get(authenticatedUser, getSingleUser)
    .patch(authenticatedUser, editSingleUser);

module.exports = router;