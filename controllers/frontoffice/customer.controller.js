const crypto = require("crypto");
const bcrypt = require("bcrypt");
require("dotenv").config();
bcryptSalt = process.env.BCRYPT_SALT;
const Customer = require("../../models/customer.model");
const { check, validationResult } = require("express-validator");
const Add_Customer_Controller = async (req, res) => {
  try {
    // Validate request body
    await Promise.all([
      check("first_name")
        .notEmpty()
        .withMessage("First name is required")
        .run(req),
      check("last_name")
        .notEmpty()
        .withMessage("Last name is required")
        .run(req),
      check("username").notEmpty().withMessage("Username is required").run(req),
      check("email").isEmail().withMessage("Email is required").run(req),
      check("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long")
        .run(req),
    ]);

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors });
    }

    const { first_name, last_name, username, email, password } = req.body;
    // Check if email or username already exist in the database
    const existingUser = await Customer.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      // If a user with the same email or username is found, return a 403 status
      return res
        .status(403)
        .json({ message: "Email or username already exists" });
    }
    // Create a new customer instance
    const newCustomer = new Customer({
      first_name,
      last_name,
      username,
      email,
      password,
    });
    // Activate accont here

    // Save the new customer to the database
    const savedCustomer = await newCustomer.save();

    res.status(201).json({
      success: true,
      message: "Customer added successfully",
      customer: savedCustomer,
    });
  } catch (error) {
    console.error("Error adding customer:", error);
    res.status(500).json({
      success: false,
      message: "Error adding customer",
      error: error.message,
    });
  }
};

module.exports = {
  Add_Customer_Controller,
};
