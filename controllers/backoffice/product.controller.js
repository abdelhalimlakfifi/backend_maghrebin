const Product = require("../../models/productModel");
const {
    body,
    validationResult
} = require("express-validator");
const {
    internalError
} = require("../../utils/500");
const mongoose = require("mongoose");

const storingValidation = [
    body("id").notEmpty().withMessage("Product ID must not be empty"),
    body("ref").notEmpty().withMessage("Product ref must not be empty"),
    body("images")
    .isArray({
        min: 1
    })
    .withMessage("At least one image must be provided"),
];

// Get All Products
const getAll = async (req, res) => {
    try {
        const products = await Product.find({
            deleted: false
        });
        res.json(products);
    } catch (err) {
        internalError(res, err.message);
    }
};

// Get One product by ID
const getOne = async (req, res) => {
    const {
        id
    } = req.params;

    try {
        const product = await Product.findOne({
            id: id,
            deleted: false
        });

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.json(product);
    } catch (err) {
        internalError(res, err.message);
    }
};

// Store a new Product
const store = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        const {
            id,
            ref,
            images
        } = req.body;

        const existingProduct = await Product.findOne({
            id
        });

        if (existingProduct) {
            if (existingProduct.deleted) {
                existingProduct.deleted = false;
                existingProduct.deletedAt = null;
                await existingProduct.save();
                return res.status(200).json({
                    message: "Product restored successfully",
                    product: existingProduct,
                });
            } else {
                return res.status(409).json({
                    error: "Product already exists"
                });
            }
        } else {
            const newProduct = new Product({
                id,
                ref,
                images,
                deleted: false,
            });
            await newProduct.save();
            return res.status(201).json(newProduct);
        }
    } catch (err) {
        internalError(res, err.message);
    }
};

// Search for products
const search = async (req, res) => {
    try {
        const ref = req.query.ref;

        const products = await Product.find({
            ref: ref,
            deleted: false,
        });

        if (products.length === 0) {
            return res.status(404).json({
                status: 404,
                message: "No product found",
            });
        }

        return res.json(products);
    } catch (err) {
        return internalError(res, err.message);
    }
};

// Update product
// halim normalement : prevent updating id ? update only the other fields
const update = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    const {
        id
    } = req.params;
    const {
        id: newId,
        ref,
        images
    } = req.body;
    //  or
    //  const {  ref, images } = req.body;

    try {
        const product = await Product.findOne({
            id: id,
            deleted: false
        });
        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        if (newId) {
            product.id = newId;
        }
        if (ref) {
            product.ref = ref;
        }

        // or
        // product.ref = ref ;

        // handel image not yet 

        await product.save();
        res.json(product);
    } catch (err) {
        internalError(res, err.message);
    }
};

// Delete product
const remove = async (req, res) => {
    const {
        id
    } = req.params;

    try {
        const product = await Product.findOneAndUpdate({
            id: id
        }, {
            deleted: true,
            deletedAt: new Date()
        });

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        return res
            .status(200)
            .json({
                message: "Product soft deleted successfully"
            });
    } catch (error) {
        internalError(res, err.message);
    }
};

module.exports = {
    getAll,
    getOne,
    store,
    search,
    update,
    remove,
    storingValidation,
};