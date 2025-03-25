const express = require('express');
const router = express.Router();

const {
    authenticatedUser,
    authorizePermissions,
} = require('../middleware/authentication');

const {
    createBook,
    getAllBooks,
    getSingleBook,
    updateBook,
    deleteBook,
    uploadImage,
} = require('../controllers/bookController');

router
    .route('/')
    .get(getAllBooks)
    .post([authenticatedUser, authorizePermissions('admin', 'employee')], createBook);

router
    .route('/uploadImage')
    .post([authenticatedUser, authorizePermissions('admin', 'employee')], uploadImage);

router.
    route('/:id')
    .get(getSingleBook)
    .patch([authenticatedUser, authorizePermissions('admin', 'employee')], updateBook)
    .delete([authenticatedUser, authorizePermissions('admin', 'employee')], deleteBook);

module.exports = router;