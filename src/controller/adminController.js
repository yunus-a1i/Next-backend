// src/controllers/adminController.js
import Admin from '../models/adminModel.js';

const isProduction = process.env.NODE_ENV === 'production';
const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'lax',
};

export async function createAdmin(req, res, next) {
  try {
    const { name, email, password } = req.body;
    if (!(name && email && password)) {
      return res.status(400).json({ success: false, message: 'name, email and password are required.' });
    }

    const existing = await Admin.findOne({ email });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Admin with this email already exists.' });
    }

    let admin = new Admin({ name, email, password });
    admin = await admin.save();

    const { password: _, ...adminSafe } = admin.toObject();
    return res.status(201).json({ success: true, message: 'Admin created.', data: adminSafe });
  } catch (err) {
    next(err);
  }
}

export async function loginAdmin(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!(email && password)) {
      return res.status(400).json({ success: false, message: 'email and password are required.' });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found.' });
    }

    const ok = await admin.isPasswordCorrect(password);
    if (!ok) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const accessToken = admin.generateAccessToken();
    const refreshToken = admin.generateRefreshToken();

    // persist tokens on admin doc
    admin.accessToken = accessToken;
    admin.refreshToken = refreshToken;
    await admin.save();

    // set cookies + headers
    res.setHeader('Authorization', `Bearer ${accessToken}`);
    res.setHeader('Refresh-Token', refreshToken);

    const { password: _, refreshToken: __, accessToken: ___, ...adminSafe } = admin.toObject();

    return res
      .cookie('accessToken', accessToken, cookieOptions)
      .cookie('refreshToken', refreshToken, cookieOptions)
      .status(200)
      .json({ success: true, message: 'Admin logged in.', data: adminSafe, accessToken });
  } catch (err) {
    next(err);
  }
}

export async function logoutAdmin(req, res, next) {
  try {
    const adminId = req?.admin?._id;
    if (!adminId) {
      return res.status(401).json({ success: false, message: 'Unauthorized.' });
    }

    const admin = await Admin.findByIdAndUpdate(
      adminId,
      { $set: { accessToken: null, refreshToken: null } },
      { new: true }
    ).select('-password -accessToken -refreshToken');

    const cookieClear = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
    };

    return res
      .clearCookie('accessToken', cookieClear)
      .clearCookie('refreshToken', cookieClear)
      .status(200)
      .json({ success: true, message: 'Admin logged out.', data: admin });
  } catch (err) {
    next(err);
  }
}

export async function getAdminProfile(req, res, next) {
  try {
    const admin = req.admin;
    if (!admin) return res.status(401).json({ success: false, message: 'Unauthorized.' });
    // admin is already fetched without password in middleware
    return res.status(200).json({ success: true, data: admin });
  } catch (err) {
    next(err);
  }
}
