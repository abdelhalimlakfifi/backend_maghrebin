// authRoutes.js
const express = require("express");
const { loginCustomer, validateLogin } = require("../../controllers/frontoffice/customerAuthController");

const router = express.Router();

router.post("/login", validateLogin, loginCustomer);

module.exports = router;
