// authRoutes.js
const express = require('express');
const passport = require('passport');
const { authenticateToken, authorizeAdmin} = require('../middleware/authMiddleware');
const { getAdmin } = require('../controllers/adminController'); 

const router = express.Router();

router.get('/admin', authenticateToken, passport.authenticate('jwt', { session: false }), getAdmin);
// authorizeAdmin,

module.exports = router;