const { validationResult, check, body } = require("express-validator");
const { internalError } = require("../utils/500");
const Customer = require("../models/customer.model");
const { default: mongoose } = require("mongoose");

const validateLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    await Promise.all([
      body("email").notEmpty().isEmail().run(req),
      body("password").notEmpty().run(req),
    ]);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const customer = await Customer.findOne({ email });

    if (!customer) {
      return res.status(401).json({
        error: "Customer not found",
      });
    }

    if (customer.deletedBy) {
      return res.status(403).json({
        error: "Customer account has been deactivated",
      });
    }

    // If the customer is not deleted, proceed to the next middleware
    next();
  } catch (error) {
    res.json(internalError("", error)); // Handle internal server error
  }
};
const validateRegister = async (req, res, next) => {
  try {
    const { username, email } = req.body;
    const errorsVali = [];

    // Check if email is provided and already exists
    if (!email) {
      errorsVali.push({ field: "email", message: "Email is required" });
    } else {
      const existingEmailUser = await Customer.findOne({ email });
      if (existingEmailUser) {
        errorsVali.push({ field: "email", message: "Email already exists" });
      }
    }

    // Check if username is provided and already exists
    if (!username) {
      errorsVali.push({ field: "username", message: "Username is required" });
    } else {
      const existingUsernameUser = await Customer.findOne({ username });
      if (existingUsernameUser) {
        errorsVali.push({
          field: "username",
          message: "Username already exists",
        });
      }
    }

    // Check if there are any errors
    if (errorsVali.length > 0) {
      return res.status(403).json({ errors_Validation: errorsVali });
    }

    // If no errors, proceed to the next middleware
    next();
  } catch (error) {
    res.json(internalError("", error)); // Handle internal server error
  }
};

const activateAccountValidation = [
  check("token")
    .notEmpty()
    .withMessage("Token is required")
    .isString()
    .withMessage("Invalid token format")
    .custom(async (token) => {
      const customer = await Customer.findOne({ activate_token: token });
      if (!customer) {
        throw new Error("Invalid activation token");
      }
      return true;
    }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const customerUpdateValidation = async (req, res, next) => {
  try {
    const id = req.params.id;
    console.log("id ", id);
    // Check if the provided ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid customer ID" });
    }

    // Check if customer with the provided ID exists
    const existingCustomer = await Customer.findById(id);

    if (!existingCustomer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    await Promise.all([
      body("first_name").optional().run(req),
      body("last_name").optional().run(req),

      body("username")
        .optional()
        .custom(async (value, { req }) => {
          // If username is provided, check for uniqueness
          if (value) {
            const existingUsernameUser = await Customer.findOne({
              username: value,
            });
            if (
              existingUsernameUser &&
              existingUsernameUser._id.toString() !== id
            ) {
              throw new Error("Username already exists");
            }
          }
          return true;
        })
        .run(req),

      body("email")
        .optional()
        .custom(async (value, { req }) => {
          // If email is provided, check for uniqueness
          if (value) {
            const existingEmailUser = await Customer.findOne({ email: value });
            if (existingEmailUser && existingEmailUser._id.toString() !== id) {
              throw new Error("Email already exists");
            }
          }
          return true;
        })
        .run(req),
    ]);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => error.msg);
      return res.status(400).json({ errors: errorMessages });
    }

    // If no validation errors, proceed to the next middleware
    next();
  } catch (error) {
    res.json(internalError("", error)); // Handle internal server error
  }
};
const searchCustomerValidation = [
  check("customerId")
    .notEmpty()
    .withMessage("Customer ID is required")
    .isMongoId()
    .withMessage("Invalid Customer ID format"),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const customerId = req.params.customerId;

    // Check if the customer exists
    try {
      const customer = await Customer.findById(customerId);
      if (!customer) {
        return res.status(404).json({ error: "Customer not found" });
      }
      next();
    } catch (error) {
      res.json(internalError("", error)); // Handle internal server error
    }
  },
];

module.exports = {
  validateLogin,
  validateRegister,
  customerUpdateValidation,
  searchCustomerValidation,
  activateAccountValidation,
};
