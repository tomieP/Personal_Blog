import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import {
    ValidationError,
    ConflictError,
    NotFoundError,
    BadRequestError,
    DatabaseError,
    UnauthorizedError,
    PayloadTooLargeError
} from "./AppError.js";

/**
 * Maps known third-party or dependency errors into standard AppErrors.
 * If not recognized, returns null so the caller can treat it as an unexpected error.
 */
export const mapError = (err) => {
    // 1. Zod Validation Error
    if (err instanceof ZodError) {
        const details = err.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
        }));
        return new ValidationError("Validation failed", {
            details,
            cause: err,
        });
    }

    // 2. Prisma Errors
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
            case "P2002": {
                // Unique constraint failed
                const target = err.meta?.target || "resource";
                return new ConflictError(`Duplicate entry for ${target}`, {
                    cause: err,
                });
            }
            case "P2025": {
                // Record not found
                return new NotFoundError("Resource not found", {
                    cause: err,
                });
            }
            case "P2003": {
                // Foreign key constraint failed
                return new BadRequestError("Foreign key constraint failed", {
                    cause: err,
                });
            }
            default:
                return new DatabaseError("Database request failed", {
                    cause: err,
                });
        }
    }

    if (err instanceof Prisma.PrismaClientValidationError) {
        return new BadRequestError("Database validation failed", {
            cause: err,
        });
    }

    if (err instanceof Prisma.PrismaClientInitializationError) {
        return new DatabaseError("Failed to initialize database connection", {
            cause: err,
        });
    }

    // 3. JWT Errors
    if (err.name === "JsonWebTokenError") {
        return new UnauthorizedError("Invalid token", { cause: err });
    }

    if (err.name === "TokenExpiredError") {
        return new UnauthorizedError("Token expired", { cause: err });
    }

    // 4. Multer Errors
    if (err.name === "MulterError") {
        if (err.code === "LIMIT_FILE_SIZE") {
            return new PayloadTooLargeError("File size exceeds limit", { cause: err });
        }
        return new BadRequestError(`File upload error: ${err.message}`, { cause: err });
    }

    // 5. Express / Body Parser JSON Syntax Error
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        return new BadRequestError("Malformed JSON in request body", { cause: err });
    }

    return null;
};
