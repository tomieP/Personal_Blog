import { Router } from "express";

import validate from "../../../middlewares/validate.js";
import {saveDraftSchema} from "../validations/saveDraft.schema.js";
import { listPostSchema } from "../validations/listPost.schema.js";

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

router1.get(
    "/list",
    validate({
        query:listPostSchema
    }),
    (req,res) => {
        return res.status(200).json({
            success: true,
            message: "list here",
            data:req.validatedData.query
        })
    }
)

export default router1;