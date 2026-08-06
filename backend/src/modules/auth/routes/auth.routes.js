import { Router } from "express";

import validate from "../../../middlewares/validate.js";
import { registerSchema } from "../validations/register.schema.js";
import { loginSchema } from "../validations/login.schema.js";
import authController from "../controllers/auth.controller.js";

const router = Router();

router.post(
    "/register",
    validate({
        body: registerSchema
    }),
    authController.register
);

router.post(
    "/login",
    validate({
        body: loginSchema
    }),
    authController.login
);

export default router;