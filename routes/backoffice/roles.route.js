const express = require('express');
const router = express.Router();
const roleController = require('../../controllers/backoffice/roles.controller');

// get
router.get("/", roleController.getAll);

// Post
router.post('/store',roleController.storingValidation, roleController.store);

// edit


// update


// delete



module.exports=router;