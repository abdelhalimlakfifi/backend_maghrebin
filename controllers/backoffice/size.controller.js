const { validationResult } = require('express-validator');
const Size = require('../../models/size.model'); // Adjust the path based on your project structure

// Controller for handling CRUD operations on Size model
const storingValidation = [
    body('name').notEmpty(),
    body('abreveation'),
    body('description'),
    body('bust'),
    body('hips'),
];
// Index - Get all sizes
const index = async (req, res) => {
    try {
        const sizes = await Size.find({
            deletedAt: null
        });
        res.json(sizes);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

// Store - Create a new size
const store = async (req, res) => {
    // Validate request body using express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    console.log(res.body);
    res.send("hay")
    try {
        // const newSize = new Size(req.body);
        // await newSize.save();
        // res.json(newSize);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

// GetOne - Get a single size by ID
const getOne = async (req, res) => {
    try {
        const size = await Size.findOne({
            _id: req.params.id,
            deletedAt: null
        });
        if (!size) {
            return res.status(404).json({
                message: 'Size not found'
            });
        }
        res.json(size);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

// Update - Update a size by ID
const update = async (req, res) => {
    // Validate request body using express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    try {
        const size = await Size.findOne({
            _id: req.params.id,
            deletedAt: null
        });
        if (!size) {
            return res.status(404).json({
                message: 'Size not found'
            });
        }

        // Update the size fields
        size.set(req.body);
        await size.save();

        res.json(size);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

// Destroy - Soft delete a size by ID
const destroy = async (req, res) => {
    try {
        const size = await Size.findOne({
            _id: req.params.id,
            deletedAt: null
        });
        if (!size) {
            return res.status(404).json({
                message: 'Size not found'
            });
        }

        // Soft delete by setting deletedAt and deletedBy
        size.deletedAt = new Date();
        size.deletedBy = req.user._id; // Assuming you have user information in req.user

        await size.save();
        res.json({
            message: 'Size deleted successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = {
    index,
    store,
    getOne,
    update,
    destroy,
    storingValidation
};