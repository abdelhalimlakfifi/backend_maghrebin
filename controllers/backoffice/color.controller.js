// Import necessary libraries and modules.
const Color = require('../../models/color.model');
const { internalError } = require('../../utils/500');
const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');

// Define validation rules for storing a new color.
const storingValidation = [
    body('name')
        .trim()
        .isLength({
            min: 1,
            max: 255
        })
        .withMessage('Name is required and must be less than 255 characters'),
    body('hex')
        .notEmpty()
        .isHexColor()
        .withMessage('Hex code must be a valid hexadecimal color code'),
];

// Define a function to get all colors.
const index = async (req, res) => {
    try {
        const colors = await Color.find({ deletedAt: null });
        res.json(colors);
    } catch (error) {
        internalError(res, error.message);
    }
};

// Define a function to store a new color.
const store = async (req, res) => {

    // Validate the request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(400).json({
            errors: errors.array()
        });
    }

    try {
        const {
            name,
            hex
        } = req.body;
        const createdBy = req.user._id; // Assuming you have authentication middleware setting req.user

        const existingColor = await Color.findOne({ name: name});
        if(existingColor){
            if(existingColor.deletedAt != null)
            {
                await Color.deleteOne({ _id: existingColor._id });
            }else{
                return res.status(400).json({
                    status: 400,
                    error: "Color name already exist"
                });
            }
        }
        const newColor = new Color({
            name,
            hexCode: hex,
            createdBy,
        });

        await newColor.save();

        res.json(newColor);
    } catch (error) {
        console.log(error);
        return res.json(internalError(error));
    }
};

// Define a function to get one color by name.
const getOne = async (req, res) => {
    try {
        const color = await Color.findOne({
            name: req.query.name,
            deletedAt: null
        });
        if (!color) {
            return res.status(404).json({
                message: 'Color not found'
            });
        }
        res.json(color);
    } catch (error) {
        internalError(res, error.message);
    }
};



// Define a function to update a color.
const update = async (req, res) => {
    try {
        const {
            name,
            hex
        } = req.body;
        const updatedBy = req.user.id;


        const color = await Color.findOne({name: req.query.name});

        if (!color) {
            return res.status(404).json({
                message: 'Color not found'
            });
        }

        const existingColor = await Color.findOne({ name: name});

        if(existingColor && color._id !== existingColor._id){
            return res.status(400).json({
                status: 400,
                error: "Color name already exist"
            })
        }

        color.name = name ? name : color.name;
        color.hex = hex ? hex : color.hex;

        await color.save();

        res.json(color);
    } catch (error) {
        console.log(error);
        res.json(internalError(res, error.message));
    }
};

// Define a function to delete a color.
const destroy = async (req, res) => {
    try {
        const deletedBy = req.user._id;

        const color = await Color.findOneAndUpdate({
            name: req.query.name
        }, {
            deletedAt: new Date(),
            deletedBy
        }, {
            new: true
        });

        if (!color) {
            return res.status(404).json({
                message: 'Color not found'
            });
        }

        res.json({
            message: 'Color deleted successfully'
        });
    } catch (error) {
        internalError(res, error.message);
    }
};

// Export the defined functions and validation rules for use in other parts of the application.
module.exports = {
    index,
    store,
    getOne,
    update,
    destroy,
    storingValidation
};