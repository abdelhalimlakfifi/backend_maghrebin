const express = require('express');
const router = express.Router();
const sizeController = require('../../controllers/backoffice/size.controller');
const { authenticateToken } = require('../../middleware/authMiddleware');
const {permissionMiddleware} = require('../../middleware/backoffice/permissions.middleware');



router.post('/store', authenticateToken,permissionMiddleware('size-add'), sizeController.store);





module.exports = router