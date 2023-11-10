const express = require('express');
const router  = express.Router();
const userController = require('../../controllers/backoffice/user.controller');
const { authenticateToken } = require('../../middleware/authMiddleware');
const {permissionMiddleware} = require('../../middleware/backoffice/permissions.middleware');




router.get('/', authenticateToken, permissionMiddleware('user-read'), userController.index);
router.post('/store', authenticateToken, permissionMiddleware('user-add'), userController.store);

module.exports = router