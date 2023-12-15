const express = require("express");
const {
  getCustomerWishlist,
  postCustomerWishlist,
  deleteCustomerProduct,
} = require("../../controllers/frontoffice/wishList.controller");
const wishListRoutes = express.Router();
// Get the wish list of customers
wishListRoutes.get("/:id", getCustomerWishlist);

// Post the wish list of customers
wishListRoutes.post(
  "/:customerId/wishlist/product/:productId",
  postCustomerWishlist
);

// Delete Product from the wishlist of customers
wishListRoutes.delete("/:customerId/wishlist/product", deleteCustomerProduct);
module.exports = wishListRoutes;
