// Import necessary libraries and modules.
const Categorie = require('../../models/categorie.model'); // Import the Categorie model.
const { internalError } = require('../../utils/500'); // Import a custom internalError function.
const { body, validationResult } = require('express-validator'); // Import express-validator for input validation.
const mongoose = require('mongoose'); // Import mongoose for working with MongoDB.

// Define validation rules for storing a new category.
const storingValidation = [
    body('name').notEmpty(),
    body('typeIds').notEmpty()
]

// Define a function to get all categories.
const index = async (req, res) => {
    try {
        // Find all categories that are not deleted and respond with the result.
        const categories = await Categorie.find({ deletedAt: null });
        res.json(categories);
    } catch (error) {
        res.json(internalError());
    }
}

// Define a function to store a new category.
const store = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Check if a deleted category with the same name exists and handle it.
        const existingDeletedCategorie = await Categorie.findOne({ name: req.body.name })
        if (existingDeletedCategorie) {
            if (existingDeletedCategorie.deletedAt === null) {
                res.status(409).json({ error: 'Category already exists' });
                return;
            } else {
                await existingDeletedCategorie.deleteOne();
            }
        }

        // Create a new category and save it to the database.
        let newCategorie = new Categorie({
            name: req.body.name,
            typeId: req.body.typeIds,
            createdBy: req.user._id
        });
        await newCategorie.save();

        res.json(newCategorie);
    } catch (error) {
        res.json(internalError("", error));
    }
}

// Define a function to get one category by name.
const getOne = async (req, res) => {
    try {
        const categorie = await Categorie.findOne({ $and: [{ name: req.params.name }, { deletedAt: null }] }).populate('typeId').exec();
        if (!categorie) {
            res.status(404);
            res.json({
                message: "Category not found",
                status: 404
            });
            return;
        }
        return res.json(categorie);
    } catch (error) {
        res.json(internalError("", error));
    }
}

// Define a function to search for categories.
const search = async (req, res) => {
    const query = req.params.search;
    try {
        // Search for categories based on the query and respond with the result.
        const categories = await Categorie.find({
            $or: [
                { name: { $regex: query, $options: 'i' } }
            ],
            deletedAt: null
        }).populate('typeId').exec();

        if (categories.length === 0) {
            res.status(404);
            res.json({
                status: 404,
                message: "No category found"
            });
            return;
        }

        res.json(categories);
    } catch (error) {
        res.json(internalError("", error));
    }
}

// Define a function to update a category.
const update = async (req, res) => {
    const id = req.params.id;
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(401).json({
                error: "Id not valid"
            });
            return;
        }
        const category = await Categorie.findById(id);

        if (!category) {
            res.status(404);
            res.json({
                status: 404,
                message: "Category not found"
            });
            return;
        }

        if (category.name !== req.body.name) {
            const sameName = await Categorie.findOne({
                $and: [{
                    name: req.body.name
                }, {
                    _id: { $ne: id }
                }]
            });

            if (sameName) {
                res.json({
                    status: 401,
                    messgae: "This category already exists"
                });
                return;
            }
        }

        // Update category properties and save the changes.
        category.name = req.body.name;
        category.typeId = req.body.typeIds;
        category.active = req.body.active;
        category.updatedBy = req.user._id;
        await category.save();

        res.json({
            data: category,
            status: 200
        });
    } catch (error) {
        res.json(internalError());
    }
}

// Define a function to delete a category.
const destroy = async (req, res) => {
    const identifier = req.params.identifier;

    let category;
    if (mongoose.Types.ObjectId.isValid(identifier)) {
        category = await Categorie.findById(identifier);
    } else {
        category = await Categorie.findOne({ name: identifier });
    }

    try {
        if (!category) {
            return res.status(404).json({
                status: 404,
                message: "Category not found"
            });
        }

        // Soft delete the category and respond with a success message.
        await category.softDelete(req.user._id);
        res.json({
            status: 200,
            message: "Category deleted successfully",
        });
    } catch (error) {
        res.status(500).json(internalError("", error));
    }
}

// Export the defined functions and validation rules for use in other parts of the application.
module.exports = { index, store, getOne, search, update, destroy, storingValidation };
