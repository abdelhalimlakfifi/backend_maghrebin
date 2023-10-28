const express = require('express');
const router = express.Router();
const productController = require('../../controllers/backoffice/product.controller');

// get
router.get("/", productController.getAll);

// get one
router.get('/getone/:id', productController.getOne);

// Post
router.post('/store',productController.storingValidation, productController.store);

// search
router.get('/:search', productController.search);

// update
router.put('/update/:id',productController.storingValidation, productController.update);

// delete
router.delete('/delete/:id', productController.remove);


module.exports=router;