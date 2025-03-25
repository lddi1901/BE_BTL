const express = require('express');
const router = express.Router();

const {
    authenticatedUser,
    authorizePermissions,
} = require('../middleware/authentication');

const {
    createPublisher,
    getAllPublishers,
    getSinglePublisher,
    updatePublisher,
    deletePublisher,
} = require('../controllers/publisherController');

router
    .route('/')
    .get(getAllPublishers)
    .post([authenticatedUser, authorizePermissions('admin', 'employee')], createPublisher);

router
    .route('/:id')
    .get(getSinglePublisher)
    .patch(updatePublisher)
    .delete(deletePublisher);

module.exports = router;