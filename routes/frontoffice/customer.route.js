const express = require("express");
const Customer = require("../../controllers/frontoffice/customer.controller");
const {
  validateRegister,
  customerUpdateValidation,
  searchCustomerValidation,
  activateAccountValidation,
  validateLogin,
} = require("../../middleware/frontoffice/customer.Middleware");
const customersRoutes = express.Router();
const {
  authenticateToken,
} = require("../../middleware/frontoffice/authMiddleware");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// login Customer
customersRoutes.post("/login", validateLogin, Customer.login);

// register Customer
// authenticateToken("customer-jwt"),
customersRoutes.post("/customer", upload.any(), validateRegister, Customer.Add);
// activate  account
customersRoutes.post("/active", Customer.activate);

//get all customers
customersRoutes.get("/customers", Customer.getAll);
// Set up multer to read file object send by client
// Update customer route
customersRoutes.post(
  "/update/:id",
  upload.any(),
  authenticateToken,
  customerUpdateValidation,
  Customer.Update
);
// Route to search for a customer by ID // Profile of customer
customersRoutes.get("/:id", searchCustomerValidation, Customer.search);

customersRoutes.delete("/:id", authenticateToken, Customer.destroy);

module.exports = customersRoutes;
