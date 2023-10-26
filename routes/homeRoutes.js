// routes/homeRoutes.js
const express = require('express');
const { getHome } = require('../controllers/homeController');

const router = express.Router();

// Home route
router.get('/home', getHome);

module.exports = router;
