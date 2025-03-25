const mongoose = require('mongoose');

const PublisherSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide publisher name'],
    },
    address: {
        type: String,
        required: [true, 'Please provide publisher address'],
    },
});

PublisherSchema.virtual('publisherId').get(function () {
    return this._id;
});


module.exports = mongoose.model('Publisher', PublisherSchema);