const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
            required: [true, 'Please provide book title'],
            maxlength: [100, 'Name can not be more than 100 characters'],
        },
        price: {
            type: Number,
            required: [true, 'Please provide book price'],
            default: 100000,
        },
        quantity: {
            type: Number,
            required: [true, 'Please provide quantity'],
            default: 10,
        },
        publicationYear: {
            type: Number,
            default: new Date().getFullYear(),
        },
        publisher: {
            type: mongoose.Schema.ObjectId,
            ref: 'Publisher',
        },
        image: {
            type: String,
            default: '/uploads/example.jpg',
        },
        author: {
            type: String,
        },
    },
);

module.exports = mongoose.model('Book', BookSchema);