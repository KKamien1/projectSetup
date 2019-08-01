const passport = require("koa-passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("../models/user");
const options = {};

module.exports = function(passport) {
  passport.use(
    new LocalStrategy(options, (username, password, done) => {
      User.findOne({
        username: username
      }).then(user => {
        if (!user) {
          console.log("no user");
          return done(null, false, {
            message: "No user Found"
          });
        }
        // Match
        console.log(user);
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            console.log("decrypto", user);
            return done(null, user);
          } else {
            return done(null, false, {
              message: "Password incorrect"
            });
          }
        });
      });
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
};
