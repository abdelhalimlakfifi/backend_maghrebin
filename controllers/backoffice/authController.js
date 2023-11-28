// Import necessary libraries and modules.
const bcrypt = require("bcrypt"); // For hashing and validating passwords.
const jwt = require("jsonwebtoken"); // For generating JSON Web Tokens.
const { body, validationResult } = require("express-validator"); // For input validation.
const User = require("../../models/user.model"); // Import the User model.
const passport = require("../../config/passport"); // Passport for authentication.

// Define an asynchronous function loginUser for handling user login.
const loginUser = async (req, res) => {
  const { username, password } = req.body; // Extract the username and password from the request body.

  // Validate the request body using express-validator.

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(), // Return validation errors if present.
    });
  }

  try {
    // Attempt to find a user with the given username.
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({
        error: "User not found", // Return an error if the user is not found.
      });
    }

    // Compare the provided password with the hashed password stored in the database.
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        error: "Invalid password", // Return an error if the password is invalid.
      });
    }

    // Generate a JWT token containing user information for authentication.
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.json({
      // userId: user._id,
      token,
      role: user.role, // Return the token and user role on successful login.
    });
  } catch (error) {
    return res.status(500).json({
      error: "Internal Server Error", // Return an error for any internal server error.
    });
  }
};

// Define a function checkAuth for checking if a user is authenticated.
const profile = async (req, res) => {
  return res.json({
    user: req.user, // Return user information if authenticated.
  });
};

// Define an array validateLogin for input validation using express-validator.
const validateLogin = [
  body("username").not().isEmpty().withMessage("Username cannot be empty"),
  body("password").not().isEmpty().withMessage("Password cannot be empty"),
];

// Export the loginUser, checkAuth, and validateLogin functions for use in other parts of the application.
module.exports = {
  loginUser,
  profile,
  validateLogin,
};
