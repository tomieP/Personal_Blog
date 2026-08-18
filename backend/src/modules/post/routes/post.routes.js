import { Router } from "express";

import validate from "../../../middlewares/validate.js";
import {saveDraftSchema} from "../validations/saveDraft.schema.js";
import router from "../../auth/routes/auth.routes.js";

const router1 = Router();

router1.post(
    "/save",
    validate({
        body:saveDraftSchema
    }),
    (req,res) => {
        return res.status(200).json({
            success: true,
            message: "Save draft succesfully",
            data:req.body
        })
    }
)

export default router1;