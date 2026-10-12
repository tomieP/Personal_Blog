import env from "../config/env.js";
import { AppError, ErrorCodes, mapError } from "../utils/errors/index.js";

/**
 * Centralized Error Handling Middleware for Express
 */
const errorMiddleware = (err, _req, res, _next) => {
    // If response was already sent, delegate to Express default handler
    if (res.headersSent) {
        return _next(err);
    }

    // Attempt to map recognized external errors to AppError
    let error = err instanceof AppError ? err : mapError(err);

    // If still not an AppError, treat it as an unexpected 500
    if (!error) {
        // Unexpected / programming error
        const isDev = env.nodeEnv === "development";
        error = new AppError(isDev ? err.message : "Internal Server Error", {
            statusCode: 500,
            code: ErrorCodes.INTERNAL_SERVER_ERROR,
            isOperational: false,
            cause: err,
        });
    }

    // Logging: Log operational errors lightly or full stack for non-operational
    if (!error.isOperational || env.nodeEnv === "development") {
        console.error(`[Error] ${error.code} (${error.statusCode}):`, err);
    } else {
        console.warn(`[Warn] ${error.code} (${error.statusCode}): ${error.message}`);
    }

    // Build standard error response
    const response = {
        success: false,
        message: error.message,
        error: {
            code: error.code,
            ...(error.details && { details: error.details }),
        },
    };

    // Attach stack trace only in development
    if (env.nodeEnv === "development") {
        response.stack = err.stack;
    }

    return res.status(error.statusCode).json(response);
};

export default errorMiddleware;
