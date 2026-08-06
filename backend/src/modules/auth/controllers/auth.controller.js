import authService from "../services/auth.service.js";

const register = async (req, res, next) => {
    try {
        const user = await authService.register(req.body);
        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: user
        });
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { token } = await authService.login(req.body);
        return res.status(200).json({
            success: true,
            message: "Login successful",
            token
        });
    } catch (error) {
        next(error);
    }
};

export default {
    register,
    login
};