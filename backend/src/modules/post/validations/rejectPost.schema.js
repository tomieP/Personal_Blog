import {z} from "zod";

const rejectReasonSchema = z
    .object({
        rejectReason: z
            .string({
                message: "Reject reason is required",
                message: "Reject reason must be a string"
            })
            .trim()
            .min(1, {message: "Reject reason must be at least 3 characters"})
            .max(500,{message: "Reject reason must be at most 500 characters"})
    })