import { file, ZodError } from "zod";

const validate = (schemas = {}) => {
    return (req, res, next) => {
        try {
            if (schemas.body) {
                req.body = schemas.body.parse(req.body);
            }

            if (schemas.params) {
                req.params = schemas.params.parse(req.params);
            }

            if (schemas.query) {
                req.query = schemas.query.parse(req.query);
            }

            next();
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                    success: false,
                    message: "Validation failed",
                    errors: error.issues.map((issues) => ({
                        field: issues.path.join("."),
                        message: issues.message
                    }))
                });
            }

            next(error);
        }
    };
};

export default validate;