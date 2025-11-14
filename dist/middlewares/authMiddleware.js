import jwt from 'jsonwebtoken';
import User from '../models/userModal.js';
import Hr from '../models/hrModel.js';
export async function authMiddle(req, res, next) {
    try {
        const token = req.cookies?.accessToken ||
            req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized request.',
            });
        }
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        let account = await User.findById(decodedToken._id)
            .select('-password -refreshToken')
            .exec();
        if (!account) {
            account = (await Hr.findById(decodedToken._id)
                .select('-password -refreshToken')
                .exec());
        }
        if (!account) {
            return res.status(401).json({
                success: false,
                message: 'User not found.',
            });
        }
        req.user = account;
        next();
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=authMiddleware.js.map