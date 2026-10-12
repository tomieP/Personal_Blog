import jwt from 'jsonwebtoken';
import env from '../config/env.js';
import { UnauthorizedError } from '../utils/errors/AppError.js';

const authMiddleware = (req, _res, next) => {
    // get token from authorization header
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return next(new UnauthorizedError("Token is required"));
    }

    try {
        const decoded = jwt.verify(token, env.jwtSecret);
        req.user = decoded;
        next();
    } catch (error) {
        return next(new UnauthorizedError("Invalid token"));
    }
};

export default authMiddleware;