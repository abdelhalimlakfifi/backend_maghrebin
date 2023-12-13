// customerAuthController.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const Customer = require("../../models/customer.model");
const passport = require("../../config/passport");

const validateLogin = [
  body("email").notEmpty().isEmail().withMessage("Email cannot be empty"),
  body("password").notEmpty().withMessage("Password cannot be empty"),
];

const loginCustomer = async (req, res) => {
  const { email, password } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const customer = await Customer.findOne({ email });

    if (!customer) {
      return res.status(401).json({
        error: "Customer not found",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, customer.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        error: "Invalid password",
      });
    }

    const token = jwt.sign(
      {
        id: customer._id,
        email: customer.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    return res.json({
      token,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};



module.exports = {
  loginCustomer,
  validateLogin,
};
