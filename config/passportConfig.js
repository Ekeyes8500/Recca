const passport = require('passport'),
  LocalStrat = require('passport-local').Strategy,
  FacebookStrat = require('passport-facebook').Strategy,
  User = require("../models/user"),
  config = require("./authConfig")

passport.use('local-login', new LocalStrat({
  usernameField: 'username',
  passwordField: 'password',
}, function (username, password, done) {
  console.log("You're in passport");
  User.findOne({ username: username }).then(function (user) {
    console.log("Here's the retrieved info:" + user)
    // check if username exists
    if (!user) {
      return done(null, false, { message: "Unkown username." });
      // use hash checker to check password
    } else if (!user.comparePassword(password)) {
      return done(null, false, { message: "incorrect password" });
      // if it clears both check return the user
    } else {
      return done(null, user);
    }
  })
}));

passport.use('local-signup', new LocalStrat({
  passReqToCallback: true
},
  function (req, username, password, done) {
    User.findOne({ username: username }).then(function (err, user) {
      if (err) throw err;
      if (user) {
        return done(null, false, { message: "Username in use" })
      } else if (password && req.body.firstName && req.body.lastName) {
        var newUsername = username;
        var newPassword = password;
        var newFirstName = req.body.firstName;
        var newLastName = req.body.lastName;
        User.create({
          username: newUsername,
          password: newPassword,
          firstName: newFirstName,
          lastName: newLastName
        }).then(function (newUser) {
          return done(null, newUser)
        })
      }
    })
  }
));

passport.use('facebook-auth', new FacebookStrat({
  clientID: "369801490490347",
  clientSecret: "44ebbca25fa8d5f133cb4e85482cad21",
  callbackURL: "https://serene-scrubland-33759.herokuapp.com/login/facebook/callback", 
 
}, function (accessToken, refreshToken, profile, done) {
  console.log(profile)
    User.findOne({ 'facebook.token': accessToken }).then( function (err, user) {
      if (err) return done(err);
      if (!user) {
        var newUser = new User();
        newUser.facebook.token = accessToken;
        newUser.facebook.id = profile.id
        newUser.username = profile.name,
        newUser.firstName = profile.first_name,
        newUser.lastName = profile.last_name,
        newUser.save()
          .then(done(null, user))
          .catch(err => done(err))
      } else {
        return done(null, user)
      }
    })
  }
));



passport.serializeUser(function (user, done) {
  done(null, user.id);
});


passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

module.exports = passport