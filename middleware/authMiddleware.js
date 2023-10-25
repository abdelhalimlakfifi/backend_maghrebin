const passport = require('passport');

const authenticateToken = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
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

const authorizeCustomer = (req, res, next) => {
  if (req.user.role === 'customer') {
    next();
  } else {
    return res.status(403).json({ error: 'You do not have access to this route' });
  }
};

const authorizeUser = (req, res, next) => {
  if (req.user.role === 'user') {
    next();
  } else {
    return res.status(403).json({ error: 'You do not have access to this route' });
  }
};

module.exports = {
  authenticateToken,
  authorizeCustomer,
  authorizeUser,
};
