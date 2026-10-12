import { ErrorCodes } from "./errorCodes.js";

/**
 * Base application error class.
 * All operational errors should extend this class.
 */
export class AppError extends Error {
    constructor(message, options = {}) {
        super(message);
        this.name = this.constructor.name;

        this.statusCode = options.statusCode || 500;
        this.code = options.code || ErrorCodes.INTERNAL_SERVER_ERROR;
        this.isOperational = options.isOperational !== false; // Default true
        this.details = options.details || null;

        // Preserve original error cause
        if (options.cause) {
            this.cause = options.cause;
        }

        // Capture stack trace
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

/**
 * 400 Bad Request - Malformed or invalid request
 */
export class BadRequestError extends AppError {
    constructor(message = "Bad request", options = {}) {
        super(message, {
            statusCode: 400,
            code: ErrorCodes.BAD_REQUEST,
            ...options,
        });
    }
}

/**
 * 400 Validation Error - Input validation failed
 */
export class ValidationError extends AppError {
    constructor(message = "Validation failed", options = {}) {
        super(message, {
            statusCode: 400,
            code: ErrorCodes.VALIDATION_ERROR,
            ...options,
        });
    }
}

/**
 * 401 Unauthorized - Authentication required or failed
 */
export class UnauthorizedError extends AppError {
    constructor(message = "Authentication required", options = {}) {
        super(message, {
            statusCode: 401,
            code: ErrorCodes.UNAUTHORIZED,
            ...options,
        });
    }
}

/**
 * 403 Forbidden - Authenticated but not authorized
 */
export class ForbiddenError extends AppError {
    constructor(message = "Access forbidden", options = {}) {
        super(message, {
            statusCode: 403,
            code: ErrorCodes.FORBIDDEN,
            ...options,
        });
    }
}

/**
 * 404 Not Found - Resource does not exist
 */
export class NotFoundError extends AppError {
    constructor(message = "Resource not found", options = {}) {
        super(message, {
            statusCode: 404,
            code: ErrorCodes.NOT_FOUND,
            ...options,
        });
    }
}

/**
 * 409 Conflict - Resource conflict (e.g., duplicate)
 */
export class ConflictError extends AppError {
    constructor(message = "Resource conflict", options = {}) {
        super(message, {
            statusCode: 409,
            code: ErrorCodes.CONFLICT,
            ...options,
        });
    }
}

/**
 * 413 Payload Too Large
 */
export class PayloadTooLargeError extends AppError {
    constructor(message = "Payload too large", options = {}) {
        super(message, {
            statusCode: 413,
            code: ErrorCodes.PAYLOAD_TOO_LARGE,
            ...options,
        });
    }
}

/**
 * 415 Unsupported Media Type
 */
export class UnsupportedMediaTypeError extends AppError {
    constructor(message = "Unsupported media type", options = {}) {
        super(message, {
            statusCode: 415,
            code: ErrorCodes.UNSUPPORTED_MEDIA_TYPE,
            ...options,
        });
    }
}

/**
 * 429 Too Many Requests - Rate limited
 */
export class TooManyRequestsError extends AppError {
    constructor(message = "Too many requests", options = {}) {
        super(message, {
            statusCode: 429,
            code: ErrorCodes.TOO_MANY_REQUESTS,
            ...options,
        });
    }
}

/**
 * 500 Internal Server Error - Unexpected error
 */
export class InternalServerError extends AppError {
    constructor(message = "Internal server error", options = {}) {
        super(message, {
            statusCode: 500,
            code: ErrorCodes.INTERNAL_SERVER_ERROR,
            isOperational: false, // Programming/infrastructure error
            ...options,
        });
    }
}

/**
 * 503 Service Unavailable - Temporary unavailable
 */
export class ServiceUnavailableError extends AppError {
    constructor(message = "Service temporarily unavailable", options = {}) {
        super(message, {
            statusCode: 503,
            code: ErrorCodes.SERVICE_UNAVAILABLE,
            isOperational: false,
            ...options,
        });
    }
}

/**
 * 500 Database Error
 */
export class DatabaseError extends AppError {
    constructor(message = "Database error", options = {}) {
        super(message, {
            statusCode: 500,
            code: ErrorCodes.DATABASE_ERROR,
            isOperational: false,
            ...options,
        });
    }
}