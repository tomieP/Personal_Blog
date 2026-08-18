import {z} from "zod"

export const postIdSchema = z.object({
    postId: z
    .string({
        required_error: "Post ID is required",
        invalid_type_error: "Post ID must be a string"
    })
    .uuid("Post ID must be a valid UUID")
});