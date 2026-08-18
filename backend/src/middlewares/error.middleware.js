import { Prisma } from "@prisma/client";
import env from "../config/env.js";
const errorMiddleware = (err, req, res, next) => {
    console.error(err);

    let statusCode = 500;
    let message = "Internal Server Error";

    // ===== Prisma Errors =====

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
            case "P2002":
                statusCode = 409;
                message = "Resource already exists";
                break;

            case "P2025":
                statusCode = 404;
                message = "Resource not found";
                break;

            case "P2003":
                statusCode = 400;
                message = "Foreign key constraint failed";
                break;

            default:
                statusCode = 500;
                message = "Database error";
        }
    }

    // ===== JWT Errors =====

    else if (err.name === "JsonWebTokenError") {
        statusCode = 401;
        message = "Invalid token";
    }

    else if (err.name === "TokenExpiredError") {
        statusCode = 401;
        message = "Token expired";
    }

    // ===== Normal Error =====

    else if (err instanceof Error) {
        message = err.message || message;
    }

    res.status(statusCode).json({
        success: false,
        message,
        ...(env.nodeEnv === "development" && {
            stack: err.stack,
        }),
    });
};

export default errorMiddleware;