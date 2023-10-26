// authRoutes.js
const express = require('express');
const passport = require('passport');
const { authenticateToken, authorizeCustomer } = require('../middleware/authMiddleware');
const { getCustomer } = require('../controllers/customerController'); 

const router = express.Router();

router.get('/customer', authenticateToken, passport.authenticate('jwt', { session: false }),getCustomer); 
// authorizeCustomer, 
module.exports = router;
