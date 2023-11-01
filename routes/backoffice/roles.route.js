const express = require('express');
const router = express.Router();
const roleController = require('../../controllers/backoffice/roles.controller');
const { authenticateToken } = require('../../middleware/authMiddleware');
const {permissionMiddleware} = require('../../middleware/backoffice/permissions.middleware');

// get
router.get("/", authenticateToken, permissionMiddleware('role-read'), roleController.getAll);

// Post
router.post('/store', authenticateToken, permissionMiddleware('role-add'),roleController.storingValidation, roleController.store);

// get one
router.get('/getone/:rolename', permissionMiddleware('role-read'), authenticateToken, roleController.getOne);


// search
router.get('/:search', permissionMiddleware('role-read'), authenticateToken, roleController.search);

// update
router.put('/update/:id', permissionMiddleware('role-edit'), authenticateToken, roleController.updatingValidation, roleController.update);

// delete
router.delete('/delete/:identifier',  permissionMiddleware('role-delete'), authenticateToken, roleController.destroy);


module.exports=router;