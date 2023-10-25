const passport = require('passport');

const authenticateToken = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    req.user = user;
    next();
  })(req, res, next);
};

const authorizeCustomer = (req, res, next) => {
  if (req.user.role === 'customer') {
    next();
  } else {
    return res.status(403).json({ error: 'Forbidden: You do not have access to this resource' });
  }
};

const authorizeUser = (req, res, next) => {
  if (req.user.role === 'user') {
    next();
  } else {
    return res.status(403).json({ error: 'Forbidden: You do not have access to this resource' });
  }
};

module.exports = {
  authenticateToken,
  authorizeCustomer,
  authorizeUser,
};
