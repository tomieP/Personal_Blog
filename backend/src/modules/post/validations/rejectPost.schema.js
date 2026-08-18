import {z} from "zod";

const rejectReasonSchema = z
    .object({
        rejectReason: z
            .string({
                required_error: "Reject reason is required",
                invalid_type_error: "Reject reason must be a string"
            })
            .trim()
            .min(1,"Reject reason must be at least 3 characters")
            .max(500,"Reject reason must be at most 500 characters")
    })