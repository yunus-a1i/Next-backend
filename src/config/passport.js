import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/userModel.js';
import Hr from '../models/hrModel.js';

// 🔹 these serialize/deserialize are irrelevant if you always use session: false,
// but you can keep them for consistency.
passport.serializeUser((user, done) => {
  done(null, { id: user._id, role: user.role });
});

passport.deserializeUser(async (obj, done) => {
  try {
    const { id, role } = obj;
    let user;
    if (role === 'recruiter') {
      user = await Hr.findById(id).lean();
    } else {
      user = await User.findById(id).lean();
    }
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// 🔥 Google OAuth Strategy for both candidate & HR
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL, 
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const email =
          profile.emails &&
          profile.emails[0] &&
          profile.emails[0].value;

        if (!email) return done(new Error('No email from Google'));

        // role comes from state ("candidate" | "hr")
        const state = req.query.state || 'candidate';
        const isHr = state === 'hr';

        const Model = isHr ? Hr : User;

        // 1) Try find by googleId in this collection
        let user = await Model.findOne({ googleId: profile.id });

        if (!user) {
          // 2) Try link existing account by email
          user = await Model.findOne({ email });

          const photo = profile.photos && profile.photos[0] && profile.photos[0].value;
          const displayName = profile.displayName || email.split('@')[0];

          if (user) {
            // Link Google account
            user.googleId = profile.id;
            user.authProvider = 'google';
            if (isHr) {
              user.profilePhotoUrl = user.profilePhotoUrl || photo;
            } else {
              user.profilePhotoLink = user.profilePhotoLink || photo;
            }
            await user.save();
          } else {
            // 3) Create new user in the correct collection
            const base = {
              name: displayName,
              email,
              googleId: profile.id,
              authProvider: 'google',
            };

            if (isHr) {
              user = await Hr.create({
                ...base,
                role: 'recruiter',
                profilePhotoUrl: photo,
                // contact can be filled later from UI
              });
            } else {
              user = await User.create({
                ...base,
                role: 'candidate',
                profilePhotoLink: photo,
              });
            }
          }
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    },
  ),
);

export default passport;
