const express = require("express");
const Customer_Controller = require("../../controllers/frontoffice/customer.controller");
const customersRoutes = express.Router();

customersRoutes.post("/customer", Customer_Controller.Add);

module.exports = customersRoutes;
