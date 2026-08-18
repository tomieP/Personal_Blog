import {z} from "zod";

export const titleSchema = z
    .string({invalid_type_error:"Title must be a string"})
    .trim()
    .min(1,"Title cannot be empty")
    .max(200,"Title must be at most 200 characters");
