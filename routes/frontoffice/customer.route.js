const express = require("express");
const {
  Add_Customer_Controller,
} = require("../../controllers/frontoffice/customer.controller");
const customersRoutes = express.Router();

customersRoutes.post("/customer", Add_Customer_Controller);

module.exports = customersRoutes;
