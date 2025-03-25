const Book = require('../models/Book');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const path = require('path');

const createBook = async (req, res) => {
    const book = await Book.create(req.body);
    res.status(StatusCodes.CREATED).json({ book });
};

const getAllBooks = async (req, res) => {
    const books = await Book.find({}).populate('publisher');
    res.status(StatusCodes.OK).json({ books });
}

const getSingleBook = async (req, res) => {
    const { id: bookId } = req.params;

    const book = await Book.findOne({ _id: bookId }).populate('publisher');

    if (!book) {
        throw new CustomError.NotFoundError(`No book with id ${bookId}`);
    }

    res.status(StatusCodes.OK).json({ book });
}

const updateBook = async (req, res) => {
    const { id: bookId } = req.params;

    const book = await Book.findOneAndUpdate(
        { _id: bookId },
        req.body,
        { new: true, runValidators: true },
    ).populate('publisher');

    if (!book) {
        throw new CustomError.NotFoundError(`No book with id ${bookId}`);
    }

    res.status(StatusCodes.OK).json({ book });
};

const deleteBook = async (req, res) => {
    const { id: bookId } = req.params;

    const book = await Book.findOneAndDelete({ _id: bookId });

    if (!book) {
        throw new CustomError.NotFoundError(`No book with id ${bookId}`);
    }

    console.log(book);

    res.status(StatusCodes.OK).json({ msg: 'Success! Book removed.' });
}

const uploadImage = async (req, res) => {
    if (!req.files) {
        throw new CustomError.BadRequestError('No File Upploaded');
    }

    const productImage = req.files.image;

    if (!productImage.mimetype.startsWith('image')) {
        throw new CustomError.BadRequestError('Please Upload Image');
    }

    const maxSize = 2 * 1024 * 1024;

    if (productImage.size > maxSize) {
        throw new CustomError.BadRequestError('Please upload image smaller than 2MB');
    }

    const imagePath = path.join(
        __dirname,
        '../public/uploads/' + `${productImage.name}`
    );

    await productImage.mv(imagePath);
    res.status(StatusCodes.OK).json({ image: `/uploads/${productImage.name}` });

};

module.exports = {
    createBook,
    getAllBooks,
    getSingleBook,
    updateBook,
    deleteBook,
    uploadImage,
};