const express = require('express');
const router = express.Router();
const productController = require('../../controllers/backoffice/product.controller');

// get
router.get("/", productController.getAll);


// create
router.get("/create", productController.create);

router.post('/upload-images', productController.imageProductUpload)
// get one
router.get('/getone/:id', productController.getOne);

// Post
router.post('/store', productController.store);

// search
router.get('/:search', productController.search);

// update
router.put('/update/:id', productController.update);

// delete
router.delete('/delete/:id', productController.remove);


module.exports=router;