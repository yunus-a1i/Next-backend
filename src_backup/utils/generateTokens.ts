import type { Types, Model as MongooseModel, Document } from 'mongoose';
import type { NextFunction } from 'express';
import type { IUserDocument } from '../models/userModal.ts';

type Tokens = {
  accessToken: string | null;
  refreshToken: string | null;
};

type GenerateTokensModel = MongooseModel<IUserDocument> & {
  findById(id: Types.ObjectId): Promise<IUserDocument | null>;
};

export async function generateTokens(
  id: Types.ObjectId,
  Model: GenerateTokensModel,
  next: NextFunction
): Promise<Tokens> {
  try {
    const user: IUserDocument | null = await Model.findById({ _id: id });
    if (!user) {
      return { accessToken: null, refreshToken: null };
    }
    const accessToken: string = user.generateAccessToken();
    const refreshToken: string = user.generateRefreshToken();

    user.accessToken = accessToken;
    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    next(error);
    return { accessToken: null, refreshToken: null };
  }
}
