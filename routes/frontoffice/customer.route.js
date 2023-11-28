const express = require("express");
const Customer = require("../../controllers/frontoffice/customer.controller");
const {
  validateRegister,
  customerUpdateValidation,
  searchCustomerValidation,
  activateAccountValidation,
} = require("../../middleware/customer.Middleware");
const customersRoutes = express.Router();
const { authenticateToken } = require("../../middleware/authMiddleware");

customersRoutes.post("/customer", validateRegister, Customer.Add);
// activate  account
customersRoutes.post("/:token", activateAccountValidation, Customer.activate);

//get all customers
customersRoutes.get("/customers", Customer.getAll);
// Update customer route
customersRoutes.put("/:id", customerUpdateValidation, Customer.Update);
// Route to search for a customer by ID
customersRoutes.get("/:id", searchCustomerValidation, Customer.search);

customersRoutes.delete("/:id", authenticateToken, Customer.destroy);

module.exports = customersRoutes;
