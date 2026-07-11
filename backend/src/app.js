import express from "express";

const app = express();

/**
 * Middleware
 */

// Cho phép Express đọc JSON trong body request
app.use(express.json());

/**
 * Routes
 */

// Route kiểm tra server có hoạt động hay không
app.get("/", (req, res) => {
  res.json({
    message: "Blog API is running 🚀",
  });
});

export default app;