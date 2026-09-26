import {z} from "zod";

export const limitSchema = z
    .coerce.number({message:"Page must be a number"})
    .int({message:"Page must be a int"})
    .min(1,{message: "Page cannot be empty"})
    .max(10, {message: "Page must be at most 10"})
    .default(10)