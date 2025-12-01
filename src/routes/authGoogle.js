// routes/authGoogle.js
const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const router = express.Router();

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Start OAuth flow
router.get('/',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Callback
router.get('/callback',
  passport.authenticate('google', { failureRedirect: `${FRONTEND_URL}/login`, session: false }),
  (req, res) => {
    // req.user contains the user returned from passport verify callback
    if (!req.user) return res.redirect(`${FRONTEND_URL}/login?error=oauth_failed`);

    const token = jwt.sign({ id: req.user._id, role: req.user.role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });

    // Choose how to send token to client:
    // 1) Redirect to frontend with token in query/hash (less secure for query)
    // 2) Set an httpOnly cookie (recommended)
    // 3) Return JSON if the client expects JSON

    // Example: redirect with token in URL hash (frontend reads from window.location.hash)
    const redirectUrl = `${FRONTEND_URL}/oauth-callback#access_token=${token}&id=${req.user._id}`;
    return res.redirect(redirectUrl);
  }
);

module.exports = router;
