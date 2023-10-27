const express = require('express');
const router = express.Router();
const categorieRoute = require('../../controllers/backoffice/categorie.controller');
const { authenticateToken } = require('../../middleware/authMiddleware');
const passport = require('passport');
const { categorieRead } = require('../../middleware/backoffice/categorie.middleware');

router.get('/', authenticateToken, categorieRead, categorieRoute.index);

module.exports=router;