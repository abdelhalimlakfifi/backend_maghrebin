const express = require('express');
const router = express.Router();

const subCategorieController = require('../../controllers/backoffice/subcategorie.controller')
const { authenticateToken } = require('../../middleware/authMiddleware');
const {permissionMiddleware} = require('../../middleware/backoffice/permissions.middleware');



router.post('/store', authenticateToken, permissionMiddleware('sub-categorie-add'),subCategorieController.storingValidation, subCategorieController.store)
router.put('/update', authenticateToken, permissionMiddleware('sub-categorie-add'), subCategorieController.update)
module.exports = router