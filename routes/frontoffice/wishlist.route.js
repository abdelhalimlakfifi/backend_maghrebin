const express = require("express");
const passport = require("passport");
const { authenticateToken } = require("../../middleware/authMiddleware");
const {
  getCustomerWishlist,
  postCustomerWishlist,
  deleteCustomerProduct,
} = require("../../controllers/frontoffice/wishlist.controller");

const router = express.Router();

// --------------------Routes for customers """DONT FORGET authenticateToken('customer-jwt'),"""
// Get the wish list of customers
router.get("/customer/:id", getCustomerWishlist);

// Post the wish list of customers
router.post("/customer/:customerId/wishlist/product/:productId", postCustomerWishlist);

// Delete Product from the wishlist of customers
router.delete("/customer/:customerId/wishlist/product", deleteCustomerProduct);

module.exports = router;
