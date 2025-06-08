import axios from "axios";
import FormData from "form-data";
import User from "../models/userModel.js";

export const trainModel = async (req, res) => {
    try {
        const currUser = await User.findById(req.user.userId);

        if (!currUser.premium_user && currUser.limit <= 0) {
            return res.status(403).json({
                message:
                    "You have reached your limit. Please upgrade to premium.",
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
        console.log("Forwarding token:", token);


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

        if (response.status == 200) {
            if (!currUser.premium_user) {
                currUser.limit -= 1;
                await currUser.save();
            }
            req.user = currUser;
        }

        return res.status(200).json({
            message: "Model training completed.",
            success: true,
            data: response.data,
        });
    } catch (error) {
        console.error("Error during model training:", error.message);
        return res.status(500).json({
            message: "Failed to train model.",
            success: false,
        });
    }
};
