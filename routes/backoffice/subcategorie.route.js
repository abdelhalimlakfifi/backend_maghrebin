const express = require ('express');
const router = express.Router();
const subCategorieController = require('../../controllers/backoffice/subcategorie.controller');
const { authenticateToken } = require('../../middleware/frontoffice/authMiddleware');
const {permissionMiddleware} = require('../../middleware/backoffice/permissions.middleware');


router.get('/', authenticateToken, permissionMiddleware('sub-categorie-read'), subCategorieController.index);
router.get('/getone/:name',authenticateToken, permissionMiddleware('sub-categorie-read'), subCategorieController.getOne)
router.post('/store', authenticateToken, permissionMiddleware('sub-categorie-add'), subCategorieController.storingValidation, subCategorieController.store);
router.put('/update/:id', authenticateToken, permissionMiddleware('sub-categorie-edit'), subCategorieController.storingValidation, subCategorieController.update);
router.delete('/delete/',authenticateToken, permissionMiddleware('sub-categorie-delete'), subCategorieController.storingValidation, subCategorieController.destroy);




module.exports = router;