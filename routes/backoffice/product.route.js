const express = require("express");
const router = express.Router();
const productController = require('../../controllers/backoffice/product.controller');
const multer = require("multer");
const ProductImage = require('../../models/productImage.model');



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/product_images/"); // Define the destination folder for uploads
    },
    filename: function (req, file, cb) {
        const fileExtension = file.originalname.split('.').pop();
        const cleanedFileName = file.originalname.replace(/[\s\W]+/g, '_');
        const currentDate = new Date().toISOString().replace(/[-:.]/g, '_');
        const finalFileName = currentDate + '_' + cleanedFileName + '.' + fileExtension;
        cb(null, finalFileName);
    },
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

// get
router.get("/", productController.getAll);

// create
router.get("/create", productController.create);
// get one
router.get("/getone/:id", productController.getOne);

router.get("/getAll", productController.getAll);

// Post
router.post("/store", productController.store);

// search
router.get("/:search", productController.search);

// update
router.put("/update/:id", productController.update);

// delete
router.delete("/delete/:id", productController.remove);




router.post("/upload-images", upload.fields([
    { name: "main", maxCount: 1, },
    { name: "secondary", maxCount: 1 },
    { name: "others", maxCount: 5 },
]), async (req, res) => {

    try {
        const main = new ProductImage({
            path: req.files["main"][0].destination + req.files["main"][0].filename,
            main: true,
            secondary: false,
        });
    
        await main.save();
    
    
        const secondaryImage = new ProductImage({
            path: req.files["secondary"][0].destination + req.files["secondary"][0].filename,
            main: false,
            secondary: true,
        });
    
        await secondaryImage.save();
    
        const others = req.files["others"].map(file => { 
            return {
                path: file.destination + file.filename,
                main: false,
                secondary: false
            }
        })
        


        const otherImages = await ProductImage.insertMany(others);


        return res.json({
            status: 200,
            data: {
                main: main,
                secondary: secondaryImage,
                others: otherImages
            },
            message: 'Images saved successfully'
        })

    } catch (error) {
        console.error(error);
        res.json({
            status: 500,
            message: 'Internal Server Error'
        })
    }





    // res.json(
    //     {
    //         "main": mainImage[0],
    //         "secondary": secondaryImage[0],
    //         "others": otherImages
    //     }
    // );
});

// router.post('/upload-images', productController.imageProductUpload);
module.exports=router;
