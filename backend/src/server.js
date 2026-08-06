// server.js
import app from "./app.js";
import env from "./config/env.js";

// In ra log cổng cụ thể để kiểm tra
app.listen(env.port, () => {
    console.log(`🚀 Server is running on http://localhost:${env.port}`);
});