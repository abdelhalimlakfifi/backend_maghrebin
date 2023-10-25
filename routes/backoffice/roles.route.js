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
router.put('/update/:id',roleController.updatingValidation, roleController.update);

// delete
router.delete('/delete/:identifier', roleController.destroy);


module.exports=router;