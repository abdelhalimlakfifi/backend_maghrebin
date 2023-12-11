// authRoutes.js
const express = require('express');
const passport = require('passport');
const { authenticateToken } = require('../../middleware/frontoffice/authMiddleware');
const { getAdmin } = require("../../controllers/backoffice/admin.controller"); 

const router = express.Router();

router.get('/admin', authenticateToken, passport.authenticate('jwt', { session: false }), getAdmin);
// authorizeAdmin,

module.exports = router;