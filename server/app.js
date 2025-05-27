import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

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

app.listen(process.env.PORT || 3000, () => {
    console.log("Listening...");
});
