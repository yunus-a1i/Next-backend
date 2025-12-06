import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/userModal";

// Serialize user id into session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).lean();
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email =
          profile.emails &&
          profile.emails[0] &&
          profile.emails[0].value;

        if (!email) return done(new Error("No email from Google"));

        // Try to find user by googleId
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          // Try linking to existing account by email
          user = await User.findOne({ email });

          if (user) {
            // Link Google account
            user.googleId = profile.id;
            user.picture =
              profile.photos &&
              profile.photos[0] &&
              profile.photos[0].value;

            await user.save();
          } else {
            // Create new OAuth user
            user = await User.create({
              username: profile.displayName || email.split("@")[0],
              email,
              googleId: profile.id,
              picture:
                profile.photos &&
                profile.photos[0] &&
                profile.photos[0].value,
              // password_hash remains undefined
            });
          }
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

export default passport;
