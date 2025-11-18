// src/utils/generateTokens.js
export async function generateTokens(id, Model, next) {
  try {
    // Model.findById accepts the id directly
    const user = await Model.findById(id);
    if (!user) {
      return { accessToken: null, refreshToken: null };
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.accessToken = accessToken;
    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    if (typeof next === 'function') next(error);
    return { accessToken: null, refreshToken: null };
  }
}
