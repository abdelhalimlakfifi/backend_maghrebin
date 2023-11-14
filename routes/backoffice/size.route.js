const express = require('express');
const router = express.Router();
const sizeController = require('../../controllers/backoffice/size.controller');
const { authenticateToken } = require('../../middleware/authMiddleware');
const {permissionMiddleware} = require('../../middleware/backoffice/permissions.middleware');



router.get('/', authenticateToken, permissionMiddleware('size-read'), sizeController.index);
router.get('/:id', authenticateToken, permissionMiddleware('size-read'), sizeController.getOne);
router.delete('/destroy/:id', authenticateToken, permissionMiddleware('size-read'), sizeController.destroy);
router.post('/store', authenticateToken,permissionMiddleware('size-add'), sizeController.storingValidation, sizeController.store);
router.put('/update/:id', authenticateToken,permissionMiddleware('size-edit'), sizeController.storingValidation, sizeController.update);




module.exports = router