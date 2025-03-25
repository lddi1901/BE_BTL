const Publisher = require('../models/Publisher');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');

const createPublisher = async (req, res) => {
    const { name, address } = req.body;
    const publisherExist = await Publisher.findOne({ name, address });
    if (publisherExist) {
        throw new CustomError.BadRequestError('Publisher exists');
    }
    const publisher = await Publisher.create({ name, address });
    res.status(StatusCodes.CREATED).json({ publisher });
}

const getAllPublishers = async (req, res) => {
    const publishers = await Publisher.find({});
    res.status(StatusCodes.OK).json({ publishers });
};

const getSinglePublisher = async (req, res) => {
    const { id: publisherId } = req.params;

    const publisher = await Publisher.findById(publisherId);

    if (!publisher) {
        throw new CustomError.NotFoundError(`No publisher with id ${publisherId}`);
    }

    res.status(StatusCodes.OK).json({ publisher });
};

const updatePublisher = async (req, res) => {
    const { id: publisherId } = req.params;
    const { name, address } = req.body;
    const publisherExist = await Publisher.findOne({ name, address });
    if (publisherExist) {
        throw new CustomError.BadRequestError('Publisher exists');
    }
    const publisher = await Publisher.findOneAndUpdate(
        { _id: publisherId },
        req.body,
        { new: true, runValidators: true },
    );

    if (!publisher) {
        throw new CustomError.NotFoundError(`No publisher with id ${publisherId}`);
    }

    res.status(StatusCodes.OK).json({ publisher });
};

const deletePublisher = async (req, res) => {
    const { id: publisherId } = req.params;

    const publisher = await Publisher.findOneAndDelete(
        { _id: publisherId },
        req.body,
        { new: true, runValidators: true },
    );

    if (!publisher) {
        throw new CustomError.NotFoundError(`No publisher with id ${publisherId}`);
    }

    res.status(StatusCodes.OK).json({ msg: 'Success! Publisher removed.' });
}

module.exports = {
    createPublisher,
    getAllPublishers,
    getSinglePublisher,
    updatePublisher,
    deletePublisher,
}