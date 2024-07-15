const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const User = require('../src/models/User');
const keys = 'Kajal123';  // Consider storing your keys securely, not hard-coded like this

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys;

module.exports = passport => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      User.findById(jwt_payload.user.id)
        .then(user => {
          if (user) {
            return done(null, user);
          }
          return done(null, false);  // User not found
        })
        .catch(err => {
          console.error(err);  // Log the error for debugging
          return done(err, false);  // Error occurred
        });
    })
  );
};
