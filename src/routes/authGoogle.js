import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const router = express.Router();

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// 👉 Candidate Google login
router.get(
  '/candidate',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    state: 'candidate',
  }),
);

// 👉 HR Google login
router.get(
  '/hr',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    state: 'hr',
  }),
);

// 👉 Common callback for both
router.get(
  '/callback',
  passport.authenticate('google', {
    failureRedirect: `${FRONTEND_URL}/login`,
    session: false,
  }),
  (req, res) => {
    if (!req.user) {
      return res.redirect(`${FRONTEND_URL}/login?error=oauth_failed`);
    }

    // user from passport has role: 'candidate' | 'recruiter'
    const token = jwt.sign(
      { id: req.user._id, role: req.user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
      },
    );

    const redirectUrl = `${FRONTEND_URL}/oauth-callback#access_token=${token}&id=${req.user._id}&role=${req.user.role}`;
    return res.redirect(redirectUrl);
  },
);

export default router;
