import z from "zod";
import { pageSchema } from "./fields/page.schema";
import { limitSchema } from "./fields/limit.schema";

export const searchPostSchema = z
    .object({
        keyword: z
        .string({
            message: "Keyword is required",
            message: "Keyword must be a string"
        })
        .trim()
        .min(3,{message:"Keyword must be at least 3 characters"})
        .max(200,{message:"Keyword must be at most 200 characters"}),
        page: pageSchema,
        limit: limitSchema
    })