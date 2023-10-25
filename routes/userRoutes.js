// authRoutes.js
const express = require('express');
const passport = require('passport');
const { authenticateToken, authorizeUser} = require('../middleware/authMiddleware');
const { getUser } = require('../controllers/userController'); 

const router = express.Router();

router.get('/user', authenticateToken, passport.authenticate('jwt', { session: false }), authorizeUser, getUser);

module.exports = router;