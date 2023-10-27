const express = require('express');
const router = express.Router();
const categorieController = require('../../controllers/backoffice/categorie.controller');
const { authenticateToken } = require('../../middleware/authMiddleware');
const { categorieMiddleware } = require('../../middleware/backoffice/categorie.middleware');

router.get('/', authenticateToken, categorieMiddleware('categorie-read'), categorieController.index);
router.post('/store', authenticateToken, categorieMiddleware('categorie-read'), categorieController.storingValidation , categorieController.store);
router.get('/getone/:categoriename',authenticateToken, categorieMiddleware('categorie-read'), categorieController.getOne);
router.get('/search/:search',authenticateToken, categorieMiddleware('categorie-read'), categorieController.search);
router.put('/update/:id',authenticateToken, categorieMiddleware('categorie-edit'),categorieController.storingValidation, categorieController.update);
module.exports=router;