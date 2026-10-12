import { ZodError } from "zod";
import { ValidationError } from "../utils/errors/AppError.js";

const validate = (schemas = {}) => {
    return (req, _res, next) => {
        try {
            req.validatedData = {};

            if (schemas.body) {
                req.validatedData.body = schemas.body.parse(req.body);
            }

            if (schemas.params) {
                req.validatedData.params = schemas.params.parse(req.params);
            }

            if (schemas.query) {
                req.validatedData.query = schemas.query.parse(req.query);
            }

            next();
        } catch (error) {
            if (error instanceof ZodError) {
                return next(new ValidationError("Validation failed", {
                    details: error.issues.map((issue) => ({
                        field: issue.path.join("."),
                        message: issue.message,
                    })),
                }));
            }

            next(error);
        }
    };
};

export default validate;