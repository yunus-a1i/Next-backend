export async function generateTokens(id, Model, next) {
    try {
        const user = await Model.findById({ _id: id });
        if (!user) {
            return { accessToken: null, refreshToken: null };
        }
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.accessToken = accessToken;
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    }
    catch (error) {
        next(error);
        return { accessToken: null, refreshToken: null };
    }
}
//# sourceMappingURL=generateTokens.js.map