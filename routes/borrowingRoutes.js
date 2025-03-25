const express = require('express');
const router = express.Router();

const {
    authenticatedUser,
    authorizePermissions,
} = require('../middleware/authentication');

const {
    getAllBorrowings,
    createBorrowing,
    getSingleBorrowing,
    updateBorrowing,
    getCurrentBorrowings,
} = require('../controllers/borrowingController');

router
    .route('/')
    .post(authenticatedUser, createBorrowing)
    .get(authenticatedUser, authorizePermissions('admin', 'employee'), getAllBorrowings);

router
    .route('/showAllMyBorrowings')
    .get(authenticatedUser, getCurrentBorrowings);

router
    .route('/:id')
    .get(authenticatedUser, getSingleBorrowing)
    .patch(authenticatedUser, authorizePermissions('admin', 'employee'), updateBorrowing);

module.exports = router;