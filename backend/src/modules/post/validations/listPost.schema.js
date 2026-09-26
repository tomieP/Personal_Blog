import {z} from "zod";
import { pageSchema } from "./fields/page.schema.js";
import { limitSchema } from "./fields/limit.schema.js";

export const listPostSchema = z
    .object({
        page: pageSchema,
        limit: limitSchema,
        sort: z
            .enum(["latest", "oldest"], "Sort must be either latest or oldest")
            .default("latest"),
    });