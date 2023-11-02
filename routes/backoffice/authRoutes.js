// authRoutes.js
const express = require("express");
const authController = require("../../controllers/backoffice/authController");
const { authenticateToken } = require('../../middleware/authMiddleware');
const router = express.Router();

router.post("/login", authController.validateLogin, authController.loginUser);
router.get('/checkAuth', authenticateToken, authController.checkAuth)

module.exports = router;
