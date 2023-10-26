// config/passport.js
const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../models/user.model");

// Configure options for JWT authentication strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

// Create a JWT authentication strategy
passport.use(
  new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
    try {
      // Attempt to find a user in the database by their ID extracted from the JWT payload
      const user = await User.findById(jwtPayload.id);

      if (!user) {
        // If no user is found, authentication fails with no errors
        return done(null, false);
      }

      // If a user is found, authentication is successful, and the user object is returned
      return done(null, user);
    } catch (error) {
      // If an error occurs during the authentication process, it is passed to `done`
      return done(error, false);
    }
  })
);

// Export the configured Passport instance
module.exports = passport;
