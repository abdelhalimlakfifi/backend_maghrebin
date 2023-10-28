const express = require('express');
const router = express.Router();
const typeController = require('../../controllers/backoffice/type.controller');
const { authenticateToken } = require('../../middleware/authMiddleware');
const {permissionMiddleware} = require('../../middleware/backoffice/permissions.middleware');


router.get('/', authenticateToken,permissionMiddleware('type-read'), typeController.index);
router.get('/getone/:identifier', authenticateToken,permissionMiddleware('type-read'), typeController.getOne)
router.post('/store', authenticateToken,permissionMiddleware('type-add'), typeController.storingVlidation, typeController.store);
router.put('/update/:identifier', authenticateToken,permissionMiddleware('type-edit'), typeController.storingVlidation, typeController.update);
router.delete('/delete/:identifier', authenticateToken,permissionMiddleware('type-delete'), typeController.storingVlidation, typeController.destroy);



module.exports = router