const express = require('express');
const router = express.Router();
const categorieController = require('../../controllers/backoffice/categorie.controller');
const { authenticateToken } = require('../../middleware/authMiddleware');
const passport = require('passport');
const { categorieMiddleware } = require('../../middleware/backoffice/categorie.middleware');

router.get('/', authenticateToken, categorieMiddleware('categorie-read'), categorieController.index);
router.post('/store', authenticateToken, categorieMiddleware('categorie-read'), categorieController.storingValidation , categorieController.store);

module.exports=router;