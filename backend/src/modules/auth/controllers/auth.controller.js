import authService from "../services/auth.service.js";

const register = async (req, res, next) => {
    try{
        const result = await authService.register(req.body);

        return res.json(result);
    } catch (error){
        next(error);
    }
};

export default {
    register
};