const bcrypt = require("bcrypt");
require("dotenv").config();
bcryptSalt = process.env.BCRYPT_SALT;
const Customer = require("../../models/customer.model");
const { check, validationResult } = require("express-validator");
const Add = async (req, res) => {
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
    const errorsVali = [];

    // Check if email already exists
    const existingEmailUser = await Customer.findOne({ email });
    if (existingEmailUser) {
      errorsVali.push({ field: "email", message: "Email already exists" });
    }

    // Check if username already exists
    const existingUsernameUser = await Customer.findOne({ username });
    if (existingUsernameUser) {
      errorsVali.push({
        field: "username",
        message: "Username already exists",
      });
    }

    if (errorsVali.length > 0) {
      // If there are errors, return a 403 status with the array of errors
      return res.status(403).json({ errors_Validation: errorsVali });
    }
    const hash = await bcrypt.hash(password, Number(bcryptSalt));

    // Create a new customer instance
    const newCustomer = new Customer({
      first_name,
      last_name,
      username,
      email,
      password: hash,
    });
    // Activate accont here

    // Save the new customer to the database
    const savedCustomer = await newCustomer.save();

    res.status(200).json({
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
  Add,
};
