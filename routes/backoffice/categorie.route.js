const express = require('express');
const router = express.Router();
const categorieRoute = require('../../controllers/backoffice/categorie.controller');
const { authenticateToken } = require('../../middleware/authMiddleware');
const passport = require('passport');


router.get('/', authenticateToken, passport.authenticate('jwt', { session: false }), categorieRoute.index);

module.exports=router;