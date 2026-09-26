import {z} from "zod"

export const postIdSchema = z.object({
    postId: z
    .string({
        message: "Post ID is required",
        message: "Post ID must be a string"
    })
    .uuid({message: "Post ID must be a valid UUID"})
});