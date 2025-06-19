import axios from "axios";
import FormData from "form-data";
import User from "../models/userModel.js";

const logger = {
    error: (message) =>
        console.error(`[ERROR] ${new Date().toISOString()} - ${message}`),
    info: (message) =>
        console.log(`[INFO] ${new Date().toISOString()} - ${message}`),
    warn: (message) =>
        console.warn(`[WARN] ${new Date().toISOString()} - ${message}`),
};

export const trainModel = async (req, res) => {
    try {
        const currUser = await User.findById(req.user.userId);

        if (!currUser) {
            return res.status(404).json({
                message: "User not found.",
                success: false,
            });
        }

        if (!currUser.premium_user && currUser.limit <= 0) {
            return res.status(403).json({
                message:
                    "You have reached your limit. Please upgrade to premium.",
                success: false,
            });
        }

        if (
            !req.body.model_name ||
            !req.body.target_col ||
            !req.body.endpoint ||
            !req.file
        ) {
            return res.status(400).json({
                message:
                    "Missing required fields: model_name, target_col, endpoint, or file.",
                success: false,
            });
        }

        const formData = new FormData();
        formData.append("model_name", req.body["model_name"]);
        formData.append("target_col", req.body["target_col"]);
        formData.append("csv_file", req.file.buffer, {
            filename: req.file.originalname,
            contentType: req.file.mimetype,
        });

        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({
                message: "Authorization token missing.",
                success: false,
            });
        }

        const response = await axios.post(
            `http://localhost:8000/api/v1/${req.body.endpoint}/`,
            formData,
            {
                headers: {
                    ...formData.getHeaders(),
                    Authorization: `Bearer ${token.replace(/^Bearer\s+/i, "")}`,
                },
            }
        );

        if (response.status === 200) {
            if (!currUser.premium_user) {
                currUser.limit -= 1;
                await currUser.save();
            }
            req.user = currUser;
            return res.status(200).json({
                message: "Model training completed.",
                success: true,
                data: response.data,
            });
        } else {
            return res.status(response.status).json({
                message: "Model training failed at ML server.",
                success: false,
                error: response.data,
            });
        }
    } catch (error) {
        logger.error(`Error during model training: ${error.message}`);

        if (error.response) {
            return res.status(error.response.status || 500).json({
                message: "Error from ML server.",
                success: false,
                error: error.response.data || error.message,
            });
        } else if (error.request) {
            return res.status(500).json({
                message: "No response from ML server.",
                success: false,
                error: error.message,
            });
        } else {
            return res.status(500).json({
                message: "Internal server error.",
                success: false,
                error: error.message,
            });
        }
    }
};
