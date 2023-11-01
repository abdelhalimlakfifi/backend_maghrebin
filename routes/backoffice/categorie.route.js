const express = require('express');
const router = express.Router();
const categorieController = require('../../controllers/backoffice/categorie.controller');
const { authenticateToken } = require('../../middleware/authMiddleware');
const {permissionMiddleware} = require('../../middleware/backoffice/permissions.middleware');


router.get('/', authenticateToken, permissionMiddleware('categorie-read'), categorieController.index);
router.post('/store', authenticateToken, permissionMiddleware('categorie-add'), categorieController.storingValidation , categorieController.store);
router.get('/getone/:name',authenticateToken, permissionMiddleware('categorie-read'), categorieController.getOne);
router.get('/search/:search',authenticateToken, permissionMiddleware('categorie-read'), categorieController.search);
router.put('/update/:id',authenticateToken, permissionMiddleware('categorie-edit'),categorieController.storingValidation, categorieController.update);
router.delete('/delete/:identifier',authenticateToken, permissionMiddleware('categorie-edit'), categorieController.destroy)

module.exports=router;