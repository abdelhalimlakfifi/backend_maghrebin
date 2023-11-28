const express = require('express');
const router  = express.Router();
const userController = require('../../controllers/backoffice/user.controller');
const { authenticateToken } = require('../../middleware/authMiddleware');
const {permissionMiddleware} = require('../../middleware/backoffice/permissions.middleware');

const multer = require('multer')

router.get('/', userController.index);
// router.get('/', authenticateToken, permissionMiddleware('user-read'), userController.index);

router.post('/store',authenticateToken, permissionMiddleware('user-add'), userController.store);


router.get('/getOne/:username',authenticateToken, permissionMiddleware('user-read'), userController.getOne )

router.get('/search',authenticateToken, permissionMiddleware('user-read'), userController.search); 

router.delete('/destroy/:username',authenticateToken, permissionMiddleware('user-delete'), userController.destroy )

router.put('/update/:identifier',authenticateToken, permissionMiddleware('user-edit'), userController.update )

router.patch('/change-password',authenticateToken, permissionMiddleware('user-edit'), userController.passwordChanger )


module.exports = router