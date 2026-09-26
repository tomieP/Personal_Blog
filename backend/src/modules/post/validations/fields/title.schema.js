import {z} from "zod";

export const titleSchema = z
    .string({message: "Title must be a string"})
    .trim()
    .min(1,{message: "Title cannot be empty"})
    .max(200,{message: "Title must be at most 200 characters"});
