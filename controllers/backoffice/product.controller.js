const Product = require("../../models/product.model");
const { body, validationResult } = require("express-validator");
const { internalError } = require("../../utils/500");
const Type = require('../../models/type.model');
const Categorie = require('../../models/categorie.model');
const SubCategorie = require('../../models/subCetegorie.model');
const Color = require('../../models/color.model');
const Size = require('../../models/size.model');
const multer = require('multer');
const ProductImage = require('../../models/productImage.model');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `uploads/product_images`);
    },
    filename: (req, file, cb) => {
        const fileExtension = file.originalname.split('.').pop();
        const cleanedFileName = file.originalname.replace(/[\s\W]+/g, '_');
        const currentDate = new Date().toISOString().replace(/[-:.]/g, '_');
        const finalFileName = currentDate + '_' + cleanedFileName + '.' + fileExtension;
        cb(null, finalFileName);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only PNG, JPEG, JPG, and WebP images are allowed.'));
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 2 * 1024 * 1024, // 2MB limit for each file
    },
});

const uploadFiles = upload.fields([
    { name: 'main', maxCount: 1 },
    { name: 'secondaryImage', maxCount: 1 },
    { name: 'others', maxCount: 20 },
]);
const storingValidation = [
    body("id").notEmpty().withMessage("Product ID must not be empty"),
    body("ref").notEmpty().withMessage("Product ref must not be empty"),
    body("images")
    .isArray({
        min: 1
    })
    .withMessage("At least one image must be provided"),
];


const imageProductUpload = async (req, res) => {

    try {

        uploadFiles(req, res, async (err) => {
            if (err) {
                return res.status(400).send('Error uploading files.');
            }
    
            // Multer has processed the files, and they are available in req.files
            console.log(req.files);

            const mainImage = new ProductImage({
                path: req.files.main[0].destination + '/' + req.files.secondaryImage[0].filename,
                main: true,
                secondary: false,
            });

            await mainImage.save();

            const secondaryImage = new ProductImage({
                path: req.files.secondaryImage[0].destination + '/' + req.files.secondaryImage[0].filename,
                main: false,
                secondary: true,
            });
            await secondaryImage.save();



            const others = req.files.others.map((image) => {
                const newPath = `${image.destination}/${image.filename}`;

                return {
                    path: newPath,
                    main: false,
                    secondary: false
                }
            })

            const otherImages = await ProductImage.create(others);

            res.status(200).json({
                main: mainImage,
                secondary: secondaryImage,
                others: otherImages
            });
        });


    } catch (error) {
        console.log(error);
        throw error
    }
}



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

        console.log("sssss");
        
        
    } catch (error) {
        console.log(error)
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
    imageProductUpload,
    storingValidation
};