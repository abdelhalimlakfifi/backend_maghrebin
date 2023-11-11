const express = require('express');
const router  = express.Router();
const userController = require('../../controllers/backoffice/user.controller');
const { authenticateToken } = require('../../middleware/authMiddleware');
const {permissionMiddleware} = require('../../middleware/backoffice/permissions.middleware');

const multer = require('multer')

router.get('/', authenticateToken, permissionMiddleware('user-read'), userController.index);
// router.post('/store', authenticateToken, permissionMiddleware('user-add'), userController.store);
router.post('/store',authenticateToken, permissionMiddleware('user-add'), userController.store);

router.get('/getOne',authenticateToken, permissionMiddleware('user-read'), userController.getOne )

module.exports = router