import express from "express";

import authRoutes from "./modules/auth/routes/auth.routes.js";
import PostRoutes from "./modules/post/routes/post.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import { NotFoundError } from "./utils/errors/AppError.js";

const app = express();
app.use(express.json());

app.get('/', (_req, res) => {
    res.send("OK");
});

// register && login
app.use("/api/v1/auth", authRoutes);

// posts
app.use("/api/v1/post", PostRoutes);

// 404 handler for unknown routes
app.use((req, _res, next) => {
    next(new NotFoundError(`Route ${req.method} ${req.originalUrl} not found`));
});

// Centralized error handler (must be last)
app.use(errorMiddleware);

export default app;