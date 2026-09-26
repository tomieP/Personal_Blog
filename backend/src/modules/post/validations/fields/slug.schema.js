import {z} from "zod";

export const slugSchema = z
    .string({message:"Slug must be a string"})
    .trim()
    .min(1,{message: "Slug cannot be empty"})
    .max(255, {message: "Slug must be at most 255 characters"})
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/,
            {message: "Slug must contain only lowercase letters, numbers, and hyphens"}
    );
