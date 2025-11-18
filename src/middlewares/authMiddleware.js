// src/middlewares/authMiddleware.js
import jwt from 'jsonwebtoken';
import User from '../models/userModal.js';
import Hr from '../models/hrModel.js';

/**
 * authMiddle
 * - reads token from cookie `accessToken` or Authorization header (Bearer ...)
 * - verifies token using ACCESS_TOKEN_SECRET (trimmed)
 * - loads user from User or Hr collection and attaches it to req.user
 */
export async function authMiddle(req, res, next) {
  try {
    const token = (req.cookies && req.cookies.accessToken) || (req.header && req.header('Authorization') && req.header('Authorization').replace(/^Bearer\s+/i, ''));

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized request. No token provided.',
      });
    }

    const rawSecret = process.env.ACCESS_TOKEN_SECRET;
    const secret = typeof rawSecret === 'string' ? rawSecret.trim() : undefined;
    if (!secret) {
      console.error('ACCESS_TOKEN_SECRET is not set');
      return res.status(500).json({ success: false, message: 'Server misconfiguration.' });
    }

    // Safe debug info (no secret printed)
    try {
      const header = JSON.parse(Buffer.from(token.split('.')[0], 'base64').toString());
      console.debug('authMiddle: token alg=', header?.alg);
    } catch (e) {
      /* ignore decode errors */
    }
    console.debug('authMiddle: ACCESS_TOKEN_SECRET length=', secret.length);

    // Verify token (explicit HS256 - change if you use another alg)
    const decoded = jwt.verify(token, secret, { algorithms: ['HS256'] });

    if (!decoded || !decoded._id) {
      return res.status(401).json({ success: false, message: 'Invalid token.' });
    }

    // Try to find user in User, then Hr
    let account = await User.findById(decoded._id).select('-password -refreshToken').exec();
    if (!account) {
      account = await Hr.findById(decoded._id).select('-password -refreshToken').exec();
    }

    if (!account) {
      return res.status(401).json({ success: false, message: 'User not found.' });
    }

    req.user = account;
    return next();
  } catch (err) {
    // Distinguish JWT errors
    if (err && err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token expired.' });
    }
    if (err && err.name === 'JsonWebTokenError') {
      console.warn('JWT verification failed:', err.message);
      return res.status(401).json({ success: false, message: 'Invalid token.' });
    }
    // Unexpected
    console.error('authMiddle unexpected error:', err);
    return next(err);
  }
}
