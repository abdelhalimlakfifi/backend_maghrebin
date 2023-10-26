const express = require('express');
const router = express.Router();
const categorieRoute = require('../../controllers/backoffice/categorie.controller');



router.get('/', categorieRoute.index);

module.exports=router;