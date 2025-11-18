// src/auth/auth.js
import User from '../models/userModal.js';
import Hr from '../models/hrModel.js';
import { generateTokens } from '../utils/generateTokens.js';

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!(email && password)) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required.',
      });
    }

    // Find user in User or Hr collections
    let Model = User;
    let account = await User.findOne({ email });

    if (!account) {
      account = await Hr.findOne({ email });
      Model = Hr;
    }

    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    const isPasswordCorrect = typeof account.isPasswordCorrect === 'function' ? await account.isPasswordCorrect(password) : false;

    if (!isPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: 'Credentials incorrect.',
      });
    }

    const { accessToken, refreshToken } = await generateTokens(account._id, Model, next);

    // set headers
    if (accessToken) {
      res.setHeader('Authorization', `Bearer ${accessToken}`);
      res.setHeader('Refresh-Token', `${refreshToken}`);
    }

    // find loggedIn user without sensitive fields
    const loggedInUser = await Model.findById(account._id).select('-password -refreshToken');

    // cookie options
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction, // secure only in production
      sameSite: isProduction ? 'none' : 'lax',
    };

    return res.status(200).cookie('accessToken', accessToken, cookieOptions).cookie('refreshToken', refreshToken, cookieOptions).json({
      success: true,
      message: 'User logged in successfully.',
      user: loggedInUser,
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
