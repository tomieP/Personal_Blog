import {z} from "zod";

const MAX_2MB = 2 * 1024 * 1024;

export const contentSchema = z
    .object({
        type: z.literal("doc", "Content must be a \"doc\""),
        content: z.array(z.unknown()).optional(),
    })
    .passthrough()
    .refine(
        (content) => {
            const size = Buffer.byteLength(JSON.stringify(content), 'utf8');
            return size <= MAX_2MB;
        },
        {
            message: "Content is over 2MB"
        }
    );