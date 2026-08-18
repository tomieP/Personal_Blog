import {z} from "zod";
import {titleSchema} from "./fields/title.schema.js";
import {contentSchema} from "./fields/content.schema.js";
import {slugSchema} from "./fields/slug.schema.js";

export const saveDraftSchema = z
    .object({
        title: titleSchema.optional(),
        content: contentSchema.optional(),
        slug: slugSchema.optional()
    })
    .refine(
        (data) => {
            return (
                data.title !== undefined    ||
                data.content !== undefined  ||
                data.slug !== undefined
            );
        },
        {
            message: "At least one field must be provided"
        }
    );
