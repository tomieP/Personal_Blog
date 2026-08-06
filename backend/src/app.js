import express from "express";

import authRoutes from "./modules/auth/routes/auth.routes.js";

const app = express();

app.use(express.json());

app.use("/api/v1/auth", authRoutes);
// app.get('/', (req, res) => {
//     res.send("API ok");
// });

export default app;