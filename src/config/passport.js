// config/passport.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).lean();
    done(null, user);
  } catch (err) {
    done(err);
  }
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // profile contains e.g. profile.id, profile.emails[0].value, profile.displayName
    const email = profile.emails && profile.emails[0] && profile.emails[0].value;
    if (!email) return done(new Error('No email from Google'));

    // Try to find by googleId first
    let user = await User.findOne({ googleId: profile.id });

    if (!user) {
      // If there's already a user with same email (registered via email/password),
      // decide whether to link accounts or reject. Here we link accounts.
      user = await User.findOne({ email });

      if (user) {
        // Link Google to existing account
        user.googleId = profile.id;
        user.picture = profile.photos && profile.photos[0] && profile.photos[0].value;
        await user.save();
      } else {
        // Create new user
        user = await User.create({
          username: profile.displayName || email.split('@')[0],
          email,
          googleId: profile.id,
          picture: profile.photos && profile.photos[0] && profile.photos[0].value,
          // password_hash left undefined for OAuth users
        });
      }
    }

    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));
