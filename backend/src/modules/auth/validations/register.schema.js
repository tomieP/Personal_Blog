import {z} from "zod";

export const registerSchema = z.object({
    username: z
    .string()
    .trim()
    .min(3, "username must be at least 3 characters")
    .max(30, "username must be at most 30 characters")
    .regex(/^[a-zA-Z0-9]+$/, "Username can only contain letters, numbers, and underscores"),

    email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Invalid email address"),

    password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(32, "Password must be at most 32 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
});