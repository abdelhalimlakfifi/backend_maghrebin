// middleware/authMiddleware.js
const passport = require("passport");

// Handel Specific Errors
const authenticateToken = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) {
      return res.status(500).json({ error: "Authentication Error" });
    }

    if (!user) {
      if (info && info.name === "TokenExpiredError") {
        return res.status(401).json({ error: "Token has expired" });
      }
      return res.status(401).json({ error: "Unauthorized" });
    }
    req.user = user;
    next();
  })(req, res, next);
};
const Customer_authenticateToken = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) {
      return res.status(500).json({ error: "Authentication Error" });
    }

    if (!user) {
      if (info && info.name === "TokenExpiredError") {
        return res.status(401).json({ error: "Token has expired" });
      }
      return res.status(401).json({ error: "Unauthorized" });
    }
    req.customer = user;
    next();
  })(req, res, next);
};

module.exports = {
  authenticateToken,
  Customer_authenticateToken,
};
