const express = require("express");
const passport = require("passport");
const { authenticateToken } = require("../../middleware/authMiddleware");
const {
  registerCustomer,
  getCustomerData,
  // getCustomerWishlist,
  // postCustomerWishlist,
  // deleteCustomerProduct,
  storingValidation,
} = require("../../controllers/frontoffice/customer.controller");

// Shared Features
// const { product } = require("../../controllers/backoffice/product.controller");
// const { categorie } = require("../../controllers/backoffice/categorie.controller");
// const { subcategorie } = require("../../controllers/backoffice/subcategorie.controller");
// const { listOrders } = require("../../controllers/backoffice/listOrders.controller");
// const { updateCustomer } = require("../../controllers/backoffice/updateCustomer.controller");

const router = express.Router();

// --------------------Routes for customers """DONT FORGET authenticateToken('customer-jwt'),"""
// Sign Up
router.post("/customer", storingValidation, registerCustomer);

// GET Data Customer by id
router.get("/customer/:id", authenticateToken('customer-jwt'), getCustomerData);

// // Get the wish list of customers
// router.get("/customer/wishlist/:id", authenticateToken('customer-jwt'), getCustomerWishlist);

// // Post the wish list of customers
// router.post("/customer/:customerId/wishlist/product", authenticateToken('customer-jwt'), postCustomerWishlist);

// // Delete Product from the wishlist of customers
// router.delete("/customer/:customerId/wishlist/product", authenticateToken('customer-jwt'), deleteCustomerProduct);

// // Get the Cart of customers
// router.get('/customer/:id/cart', authenticateToken('customer-jwt'), getCustomerCart);

// // Get the wish Order History
// router.get('/customer/:id/order', authenticateToken('customer-jwt'), getCustomerOrderHistory);

// // Shared Features
// // Get Products
// router.get('/customer/products', getAll);

// Get categories
// router.get('/categories', index);

// Get Subcategories
// router.get('/subcategories', );

// Order Products
// router.get('/customers/orders', authenticateToken('customer-jwt'), customerController.listOrders); // List Own Orders

// Update Account
// router.put('/customers/:id', authenticateToken('customer-jwt'), customerController.updateCustomer); // Update Own Account Data

// logout
// router.get()

module.exports = router;
