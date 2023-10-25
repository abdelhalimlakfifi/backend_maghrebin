const express = require('express');
const router = express.Router();
const roleController = require('../../controllers/backoffice/roles.controller');

// get
router.get("/", roleController.getAll);

// Post
router.post('/store',roleController.storingValidation, roleController.store);

// get one
router.get('/getone/:rolename', roleController.getOne);


// search
router.get('/:search', roleController.search);

// update


// delete



module.exports=router;