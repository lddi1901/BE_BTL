const Book = require('../models/Book');
const Borrowing = require('../models/Borrowing');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { checkPermissions } = require('../utils');

const createBorrowing = async (req, res) => {
    const { book, duration } = req.body;

    if (!book) {
        throw new CustomError.BadRequestError('Please provide book id');
    }

    const existBook = await Book.findById(book);


    if (!existBook) {
        throw new CustomError.BadRequestError(`No book with id ${book}`);
    }

    existBook.quantity -= 1;
    await existBook.save();

    const borrowing = await Borrowing.create({
        book,
        duration,
        reader: req.user.userId,
    });

    await (await borrowing.populate('reader', 'username')).populate('book');

    res.status(StatusCodes.CREATED).json({ borrowing });
};

const getAllBorrowings = async (req, res) => {
    const borrowings = await Borrowing.find({}).populate('book').populate('reader').populate('employee');
    borrowings.forEach(async (borrowing) => {
        if (borrowing.status === 'borrowed')
            await borrowing.save();
    });
    res.status(StatusCodes.OK).json({ borrowings });
};

const getSingleBorrowing = async (req, res) => {
    const { id: borrowingId } = req.params;
    const borrowing = await Borrowing.findOne({ _id: borrowingId }).populate('book').populate('reader');
    if (!borrowing) {
        throw new CustomError.NotFoundError(`No borrowing with id ${borrowingId}`);
    }
    console.log(borrowing);
    checkPermissions(req.user, borrowing.reader);
    res.status(StatusCodes.OK).json({ borrowing });
};

const getCurrentBorrowings = async (req, res) => {
    const borrowings = await Borrowing.find({ reader: req.user.userId }).populate('book').populate('employee');
    borrowings.forEach(async (borrowing) => {
        if (borrowing.status === 'borrowed')
            await borrowing.save();
    });
    res.status(StatusCodes.OK).json({ borrowings });
};

const updateBorrowing = async (req, res) => {
    const { id: borrowingId } = req.params;
    const { status } = req.body;

    const borrowing = await Borrowing.findOne({ _id: borrowingId });
    if (!borrowing) {
        throw new CustomError.NotFoundError(`No borrowing with id ${borrowingId}`);
    }

    const book = await Book.findById(borrowing.book);

    borrowing.status = status;
    borrowing.employee = req.user.userId;
    await borrowing.save();

    if (status === 'returned') {
        book.quantity += 1;
        await book.save();
    }

    res.status(StatusCodes.OK).json({ borrowing });
}

module.exports = {
    getAllBorrowings,
    createBorrowing,
    getSingleBorrowing,
    getCurrentBorrowings,
    updateBorrowing,
};