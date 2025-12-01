// routes/authGoogle.js
import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const router = express.Router();

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Start OAuth flow
router.get(
  '/',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Callback
router.get(
  '/callback',
  passport.authenticate('google', {
    failureRedirect: `${FRONTEND_URL}/login`,
    session: false,
  }),
  (req, res) => {
    // req.user contains the user returned from passport verify callback
    if (!req.user) {
      return res.redirect(`${FRONTEND_URL}/login?error=oauth_failed`);
    }

    const token = jwt.sign(
      { id: req.user._id, role: req.user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
      }
    );

    // Redirect to frontend with token in URL hash
    const redirectUrl = `${FRONTEND_URL}/oauth-callback#access_token=${token}&id=${req.user._id}`;
    return res.redirect(redirectUrl);
  }
);

export default router;
