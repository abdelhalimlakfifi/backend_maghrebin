// authController.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("../../models/user.model");
const passport = require("../../config/passport");

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  // Validate empty fields using express-validator
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "30sec" }
    );

    return res.json({ token, role: user.role });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


const validateLogin = [
  body("username").not().isEmpty().withMessage("Username cannot be empty"),
  body("password").not().isEmpty().withMessage("Password cannot be empty"),
];

module.exports = {
  loginUser,
  validateLogin,
};
