import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

import authRouter from "./routers/authRouter.js";
import userRouter from "./routers/userRouter.js";
import modelRouter from "./routers/modelRouter.js";
import { errorHandler } from "./controllers/userContoller.js";

const logger = {
    error: (message) =>
        console.error(`[ERROR] ${new Date().toISOString()} - ${message}`),
    info: (message) =>
        console.log(`[INFO] ${new Date().toISOString()} - ${message}`),
    warn: (message) =>
        console.warn(`[WARN] ${new Date().toISOString()} - ${message}`),
};

const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true,
    optionsSuccessStatus: 200,
};

const app = express();
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(errorHandler);

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        logger.info("Database connnected.");
    })
    .catch((err) => {
        logger.error("Database connection error:", err);
    });

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/model", modelRouter);

app.listen(process.env.PORT || 3000, () => {
    logger.info("Listening...");
});
