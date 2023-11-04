const bcrypt = require("bcrypt");
// const { body, validationResult } = require("express-validator");
// const { internalError } = require("../../utils/500");
const Customer = require("../../models/customer.model");
const Wishlist = require("../../models/wishlist.model");
const Product = require("../../models/productModel");
const mongoose = require("mongoose");

// const storingValidation = [
//   body("first_name").notEmpty().withMessage("First name is required"),
//   body("last_name").notEmpty().withMessage("Last name is required"),
//   body("email")
//     .notEmpty()
//     .withMessage("Email cannot be empty")
//     .isEmail()
//     .withMessage("Invalid email"),
//   body("password")
//     .isLength({ min: 6 })
//     .withMessage("Password must be at least 6 characters long"),
// ];

// Get Customer's Wishlist
const getCustomerWishlist = async (req, res) => {
  const customerId = req.params.id;

  try {
    const customer = await Customer.findById(customerId).populate({
      path: "wishlist",
      populate: {
        path: "products",
      },
    });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const wishlist = customer.wishlist;

    if (!wishlist) {
      return res
        .status(404)
        .json({ message: "Wishlist not found for this customer" });
    }

    res.status(200).json({ wishlist });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching customer wishlist",
      error: error.message,
    });
  }
};

// POST Customer's Wishlist
const postCustomerWishlist = async (req, res) => {
  const customerId = req.params.customerId;
  const productId = req.body.productId; 

  try {
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const productDetails = product;
    console.log(productDetails);

    const productIdToAdd = productId;

    const wishlist = await Wishlist.findOne({ customer: customerId });

    if (!wishlist) {
      const newWishlist = new Wishlist({
        customer: customerId,
        products: [productId],
        
      });
      await newWishlist.save();
    } else {
      const foundProduct = wishlist.products.find(
        (prod) => prod._id.toString() === productId
      );
      if (foundProduct) {
        return res
          .status(400)
          .json({ message: "Product already in the wishlist" });
      }

      wishlist.products.push(productId); 
      await wishlist.save();
    }

    res
      .status(200)
      .json({ message: "Product added to the wishlist", productIdToAdd });
  } catch (error) {
    res.status(500).json({
      message: "Error adding product to the wishlist",
      error: error.message,
    });
  }
};

// DELETE request to remove a product from the customer's wishlist
const deleteCustomerProduct = async (req, res) => {
  try {
      const customerId = req.params.customerId;
      const productId = req.body.productId;

      const customer = await Customer.findById(customerId);

      if (!customer) {
          return res.status(404).json({ message: "Customer not found" });
      }

      const wishlist = await Wishlist.findOne({ customer: customerId });

      if (!wishlist) {
          return res.status(404).json({ message: "Wishlist not found" });
      }

      const index = wishlist.products.indexOf(productId);
      if (index > -1) {
          wishlist.products.splice(index, 1);
          await wishlist.save();
          return res.status(200).json({ message: "Product removed from wishlist" });
      } else {
          return res.status(404).json({ message: "Product not found in wishlist" });
      }
  } catch (err) {
      return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getCustomerWishlist,
  postCustomerWishlist,
  deleteCustomerProduct,
  // storingValidation,
};
