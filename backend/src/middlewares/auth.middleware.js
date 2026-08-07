import jwt from 'jsonwebtoken';
import env from '../config/env.js';

const authMiddleware = (req, res, next) => {

    // get token from authorization header
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token){
        return res.status(401).json({
            success: false,
            message: "Token is required"
        });
    }

    try{
        const decoded = jwt.verify(token, env.jwtSecret);
        req.user = decoded;
        next();
    }catch(error){
        return res.status(401).json({
            success: false,
            message: "Invalid token"
        })
    }

};
export default authMiddleware;