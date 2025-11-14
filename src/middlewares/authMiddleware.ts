import type { NextFunction, Request, Response } from 'express';
import jwt, { type JwtPayload, type Secret } from 'jsonwebtoken';
import User, { type Iuser } from '../models/userModal.js';
import Hr, { type IhrDocument } from '../models/hrModel.js';
import type { Types } from 'mongoose';

export interface DecodedToken extends JwtPayload {
  _id: Types.ObjectId;
  name: string;
  email: string;
}

export async function authMiddle(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    const token: string | undefined =
      req.cookies?.accessToken ||
      req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized request.',
      }) as Response;
    }

    const decodedToken = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as Secret
    ) as DecodedToken;

    let account: Iuser | IhrDocument | null = await User.findById(decodedToken._id)
      .select('-password -refreshToken')
      .exec() as Iuser | null;

    if (!account) {
      account = (await Hr.findById(decodedToken._id)
        .select('-password -refreshToken')
        .exec()) as IhrDocument | null;
    }

    if (!account) {
      return res.status(401).json({
        success: false,
        message: 'User not found.',
      }) as Response;
    }

    req.user = account;

    next();
  } catch (error: unknown) {
    next(error);
  }
}


