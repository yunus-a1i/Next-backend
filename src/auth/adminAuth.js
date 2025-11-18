// src/middlewares/adminAuth.js
import jwt from 'jsonwebtoken';
import Admin from '../models/adminModel.js';

export async function adminAuth(req, res, next) {
  try {
    const token =
      (req.cookies && req.cookies.accessToken) ||
      (req.header && req.header('Authorization') && req.header('Authorization').replace(/^Bearer\s+/i, ''));

    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized. No token provided.' });
    }

    const rawSecret = process.env.ACCESS_TOKEN_SECRET;
    const secret = typeof rawSecret === 'string' ? rawSecret.trim() : undefined;
    if (!secret) {
      console.error('ACCESS_TOKEN_SECRET missing');
      return res.status(500).json({ success: false, message: 'Server misconfiguration.' });
    }

    // verify token (explicit alg HS256; change if you use different alg)
    const decoded = jwt.verify(token, secret, { algorithms: ['HS256'] });

    if (!decoded || !decoded._id) {
      return res.status(401).json({ success: false, message: 'Invalid token.' });
    }

    const admin = await Admin.findById(decoded._id).select('-password -refreshToken').exec();
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Admin not found.' });
    }

    // ensure role is admin
    if (admin.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Forbidden.' });
    }

    req.admin = admin;
    return next();
  } catch (err) {
    if (err && err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token expired.' });
    }
    if (err && err.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: 'Invalid token.' });
    }
    console.error('adminAuth error:', err);
    return next(err);
  }
}
