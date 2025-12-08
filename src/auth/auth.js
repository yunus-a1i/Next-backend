// src/auth/auth.js
import User from '../models/userModal.js';
import Hr from '../models/hrModel.js';
import { generateTokens } from '../utils/generateTokens.js';

export async function login(req, res, next) {
  try {
    const { email, password, role } = req.body;

    if (!(email && password && role)) {
      return res.status(400).json({
        success: false,
        message: 'Email, password and role are required.',
      });
    }

    // Decide which model based on role
    let Model;
    if (role === 'candidate') {
      Model = User;
    } else if (role === 'recruiter') {
      Model = Hr;
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be "candidate" or "recruiter".',
      });
    }

    const account = await Model.findOne({ email });

    if (!account) {
      return res.status(404).json({
        success: false,
        message: `${role} not found.`,
      });
    }

    const isPasswordCorrect =
      typeof account.isPasswordCorrect === 'function'
        ? await account.isPasswordCorrect(password)
        : false;

    if (!isPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: 'Credentials incorrect.',
      });
    }

    const { accessToken, refreshToken } = await generateTokens(account._id, Model, next);

    // Optional: include role in token if generateTokens supports it
    // const { accessToken, refreshToken } = await generateTokens(account._id, role, next);

    if (accessToken) {
      res.setHeader('Authorization', `Bearer ${accessToken}`);
      res.setHeader('Refresh-Token', `${refreshToken}`);
    }

    const loggedInUser = await Model.findById(account._id).select(
      '-password -refreshToken'
    );

    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
    };

    return res
      .status(200)
      .cookie('accessToken', accessToken, cookieOptions)
      .cookie('refreshToken', refreshToken, cookieOptions)
      .json({
        success: true,
        message: `${role} logged in successfully.`,
        user: loggedInUser,
        role, // 👈 tell frontend what logged in
        accessToken,
      });
  } catch (error) {
    console.error('Login error:', error);
    next(error);
  }
}


export async function logout(req, res, next) {
  try {
    const accountId = req?.user?._id;

    if (!accountId) {
      return res.status(400).json({
        success: false,
        message: 'Id is required.',
      });
    }

    let Model = User;
    let accountDoc = await User.findById(accountId);

    if (!accountDoc) {
      accountDoc = await Hr.findById(accountId);
      Model = Hr;
    }

    if (!accountDoc) {
      return res.status(404).json({
        success: false,
        message: 'Account not found.',
      });
    }

    const data = await Model.findByIdAndUpdate(accountId, { $set: { refreshToken: null, accessToken: null } }, { new: true }).select('-password -accessToken -refreshToken');

    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
    };

    return res.status(200).clearCookie('accessToken', cookieOptions).clearCookie('refreshToken', cookieOptions).json({
      success: true,
      data,
      message: 'User logout successful.',
    });
  } catch (error) {
    console.error('Logout error:', error);
    next(error);
  }
}
