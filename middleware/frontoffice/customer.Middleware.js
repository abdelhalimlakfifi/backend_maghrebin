const { validationResult, check, body } = require("express-validator");
const { internalError } = require("../../utils/500");
const Customer = require("../../models/customer.model");
const { default: mongoose } = require("mongoose");
const sendEmail = require("../../utils/email/sendEmail");
require("dotenv").config();
bcryptSalt = process.env.BCRYPT_SALT;
CLIENT_URL_ACTIVATE = process.env.CLIENT_URL_ACTIVATE;
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
        errors: "Customer not found",
      });
    }
    if (customer.deletedBy) {
      return res.status(403).json({
        errors: "Customer account has been deleted",
      });
    }
    // send activate token to customer email
    if (!customer.valid_account) {
      const activate_token = customer.activate_token;
      const link = `${CLIENT_URL_ACTIVATE}?token=${activate_token}`;
      await sendEmail(
        customer.email,
        "Activate Account ",
        {
          name: customer.first_name + " " + customer.last_name,
          link: link,
        },
        "../../utils/email/templates/requestActivateAccount.handlebars"
      );
      return res.status(406).json({
        error: "please activate your account , we send a link toy our email",
        link,
      });
    }
    next();
  } catch (error) {
    res.json(internalError("", error)); // Handle internal server error
  }
};
const validateRegister = async (req, res, next) => {
  try {
    const { email } = req.body;
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

    // Check if there are any errors
    if (errorsVali.length > 0) {
      return res.status(403).json({ errors: errorsVali });
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
      return res.status(400).json({ errors: "Invalid customer ID" });
    }

    // Check if customer with the provided ID exists
    const existingCustomer = await Customer.findById(id);

    if (!existingCustomer) {
      return res.status(404).json({ errors: "Customer not found" });
    }

    await Promise.all([
      body("first_name").optional().run(req),
      body("last_name").optional().run(req),
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
// middleware to search for customer by id and send res.status(404).json({ error: "Customer not found" });

const searchCustomerValidation = async (req, res, next) => {
  const id = req.params.id;
  console.log("id ", id);
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ errors: "Invalid customer ID" });
  }
  const existingCustomer = await Customer.findById(id);
  if (!existingCustomer) {
    return res.status(404).json({ errors: "Customer not found" });
  }
  next();
};

module.exports = {
  validateLogin,
  validateRegister,
  customerUpdateValidation,
  searchCustomerValidation,
  activateAccountValidation,
};
