const mongoose = require('mongoose');

const BorrowingSchema = new mongoose.Schema({
    reader: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide user id'],
    },
    book: {
        type: mongoose.Types.ObjectId,
        ref: 'Book',
        required: [true, 'Please provide book id'],
    },
    employee: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    },
    requestDate: {
        type: Date,
        default: new Date(),
    },
    duration: {
        type: Number,
        default: 7,
    },
    borrowDate: {
        type: Date,
    },
    returnDate: {
        type: Date,
    },
    status: {
        type: String,
        required: [true, "Please provide borrowing status"],
        enum: ['processing', 'borrowed', 'returned', 'overdue'],
        default: 'processing',
    }
});

BorrowingSchema.pre('save', function () {
    if (this.isModified('status') && this.status === 'borrowed') {
        this.borrowDate = new Date();
    }
});

BorrowingSchema.pre('save', function () {
    if (this.isModified('status') && this.status === 'returned') {
        this.returnDate = new Date();
    }
});

BorrowingSchema.pre('save', function () {
    if (this.status === 'borrowed' && this.borrowDate) {
        const currentDate = new Date();
        const overdueDate = new Date(this.borrowDate);
        overdueDate.setDate(overdueDate.getDate() + this.duration);
        if (currentDate > overdueDate) {
            this.status = 'overdue';
        }
    }
});

module.exports = mongoose.model('Borrowing', BorrowingSchema);