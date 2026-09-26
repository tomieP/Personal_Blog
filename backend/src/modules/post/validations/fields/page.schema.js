import {z} from "zod";

export const pageSchema = z
    .coerce.number({message: "Page must be a number"})
    .int({message:"Page must be a int"})
    .min(1,{message: "Page cannot be empty"})
    .max(50, {message: "Page must be at most 50"})
    .default(1)