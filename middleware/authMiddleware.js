// middleware/authMiddleware.js

const passport = require('passport');

const authenticateToken = (strategyName) => (req, res, next) => {
  passport.authenticate(strategyName, { session: false }, (err, user, info) => {
    if (err) {
      return res.status(500).json({ error: 'Authentication Error' });
    }

    if (!user) {
      if (info && info.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token has expired' });
      }
      return res.status(401).json({ error: 'Unauthorized' });
    }

    req.user = user;
    next();
  })(req, res, next);
};

module.exports = {
  authenticateToken
};

