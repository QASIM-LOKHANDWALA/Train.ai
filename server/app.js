import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

import authRouter from "./routers/authRouter.js";
import userRouter from "./routers/userRouter.js";
import modelRouter from "./routers/modelRouter.js";

const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Database connnected.");
    })
    .catch((err) => {
        console.error("Database connection error:", err);
    });

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/model", modelRouter);

app.listen(process.env.PORT || 3000, () => {
    console.log("Listening...");
});
