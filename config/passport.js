const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const Customer = require("../models/customer.model");
const User = require("../models/user.model");

function configureUserJWTStrategy() {
  const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
  };

  const userStrategy = new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
    try {
      const user = await User.findById(jwtPayload.id)
        .populate({
          path: 'role',
          populate: {
            path: 'permissions',
            model: 'Permission',
            select: 'label'
          }
        })
        .exec();

      if (!user) {
        return done(null, false);
      }

      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  });

  passport.use("user-jwt", userStrategy);
}

function configureCustomerJWTStrategy() {
  const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
  };

  const customerStrategy = new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
    try {
      const customer = await Customer.findById(jwtPayload.id);

      if (!customer) {
        return done(null, false);
      }

      return done(null, customer);
    } catch (error) {
      return done(error, false);
    }
  });

  passport.use("customer-jwt", customerStrategy);
}

configureUserJWTStrategy();
configureCustomerJWTStrategy();

module.exports = passport;
