// authRoutes.js
const express = require("express");
const authController = require("../controllers/backoffice/authController");

const router = express.Router();

router.post("/login", authController.validateLogin, authController.loginUser);

module.exports = router;
