const Product = require("../../models/product.model");
const { body, validationResult } = require("express-validator");
const { internalError } = require("../../utils/500");
const mongoose = require("mongoose");
const { uploadFileFunction } = require('../../utils/uploadFile');
const { uploadFileFunctionMultiple } = require('../../utils/uploadFile');
const Type = require('../../models/type.model');
const Categorie = require('../../models/categorie.model');
const SubCategorie = require('../../models/subCetegorie.model');
const Color = require('../../models/color.model');
const Size = require('../../models/size.model');
const generateUniqueId = require('generate-unique-id');

const storingValidation = [
    body("id").notEmpty().withMessage("Product ID must not be empty"),
    body("ref").notEmpty().withMessage("Product ref must not be empty"),
    body("images")
    .isArray({
        min: 1
    })
    .withMessage("At least one image must be provided"),
];





const create = async (req, res) => {


    try {
        const types = await Type.find();
        const categories = await Categorie.find();
        const subcategories = await SubCategorie.find();
        const colors = await Color.find();
        const sizes = await Size.find();


        res.json({
            'types': types,
            'categories': categories,
            'subcategories': subcategories,
            'sizes': sizes,
            'colors': colors
        });


    } catch (error) {
        internalError(res, error.message);
    }
}


// Get All Products
const getAll = async (req, res) => {
    try {
        const products = await Product.find({ deletedAt: null })
        .populate({
            path: 'categories_id',
            transform: function(doc){
                return doc.name
            }
        })
        .populate({
            path: 'sub_categorie_id',
            transform: function(doc){
                return doc.name
            }
        }) // Assuming 'name' is the field you want to populate from the SubCategory model
        .populate({
            path:'sizes',
            transform: function(doc){
                return doc.name
            }
        }) // Assuming 'name' is the field you want to populate from the Sizes model
        .populate({
            path: 'types',
            transform: function(doc) {
                return doc.name;
            }
        })
        .populate({
            path: 'images.image_id', // path to the ProductImage model
            model: 'ProductImage',
            transform: function (doc){
                if(doc.main || doc.secondary)
                {
                    return doc
                }
                return null
            }
        })
        .populate({
            path: 'colors',
            transform: function (doc){
                return doc.name
            }
        })
        // .populate({
        //     path: 'images.color',     // path to the Color model
        //     model: 'Color',           // model to populate
        // })
        .exec();

        

        
        res.json(products);
    } catch (err) {
        throw err.message 
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
        // const uploadedFile = await uploadFileFunctionMultiple(req, res, 'image', 'product_images');
        
        const ref = generateUniqueId({
            length: 8,
            useLetters: true
        });


        let images = req.body.data.images
        images.push(req.body.data.mainAndSecondary.main)
        images.push(req.body.data.mainAndSecondary.secondary)

        const imgs = images.map(image => {
            console.log(image.color);
            console.log(image._id);
            console.log('-------------------------------------');

            return {
                image_id: image._id,
                color: image.color
            }
        });

        console.log(imgs);
        // extract colors from images
        const uniqueColors = [...new Set(imgs.filter(item => item.color).map(item => item.color))];

        

        const types = req.body.data.filters.types.map(type =>{
            return type._id
        })
        const sizes = req.body.data.filters.sizes.map(size =>{
            return size._id
        })
        const product = new Product({
            ref: `#${ref.toUpperCase()}`,
            images: imgs,
            title:  req.body.data.information.title,
            short_description: req.body.data.information.description,
            long_description: req.body.data.information.longDescription,
            price: req.body.data.information.price,
            reviews: [],
            types: types,
            colors: uniqueColors,
            categories_id: req.body.data.filters.categorie._id,
            sub_categorie_id: req.body.data.filters.subcategorie._id,
            tags: [],
            sizes: sizes,
            createdBy: '654cc538caa271b564bcb95a',
        });
        await product.save();
        
        res.json({
            status: 200,
            product: product
        });
    } catch (error) {
        
        res.json({
            status: 500,
            message: "Internal Server Error",
        })
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
    create,
    getOne,
    store,
    search,
    update,
    remove,
    storingValidation
};