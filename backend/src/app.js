import express from "express";

import authRoutes from "./modules/auth/routes/auth.routes.js";
import authMiddleware from "./middlewares/auth.middleware.js"
import errorMiddleware from "./middlewares/error.middleware.js"

import PostRoutes from "./modules/post/routes/post.routes.js"

const app = express();
app.use(express.json());

app.get('/', (req,res)=> {
    res.send("OK")
});
// register && login
app.use("/api/v1/auth", authRoutes);

// app.get("/api/v1/prof", authMiddleware, (req,res) =>{
//     return res.json({
//         success: true,
//         message: "Truy cay TCN thanh cong",
//         userData: res.user
//     });
    
// });

app.use("/api/v1/post",PostRoutes)
app.use(errorMiddleware);
export default app;