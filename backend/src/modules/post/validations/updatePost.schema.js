import {z} from "zod";
import { titleSchema } from "./fields/title.schema";
import { contentSchema } from "./fields/content.schema";
import { slugSchema } from "./fields/slug.schema";
import { postIdSchema } from "./postId.schema";

export const updatePostSchema = z
    .object({
        title: titleSchema.optional(),
        content: contentSchema.optional(),
        slug: slugSchema.optional()
    })
    .refine(
        (data) =>
            data.title !== undefined        ||
            data.content !== undefined      ||
            data.slug !== undefined,
            {
                message: "At least one field must be provided for update"
            }
    );