import User from "../models/userModel.js";
import axios from "axios";

// Trial PUSH
export const profile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId).select("-__v");
        if (!user) {
            return res.status(404).json({
                message: "User not found.",
                success: false,
            });
        }

        return res.status(200).json({
            message: "Profile fetched successfully.",
            success: true,
            user,
        });
    } catch (error) {
        console.log(`Error fetching profile: ${error.message}`);
    }
};

export const setPremium = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId).select("-__v");
        if (!user) {
            return res.status(404).json({
                message: "User not found.",
                success: false,
            });
        }

        user.premium_user = true;
        const updatedUser = await user.save();
        return res.status(200).json({
            message: "Premium status updated.",
            success: true,
        });
    } catch (error) {
        console.log(`Error updating premium status: ${error.message}`);
    }
};

export const updateLikedModel = async (req, res) => {
    try {
        const rawAuthCookie = req.cookies["Authorization"]; // not 'token'
        let token = undefined;

        if (rawAuthCookie) {
            // Strip "Bearer " or "Bearer%20"
            token = decodeURIComponent(rawAuthCookie)
                .replace(/^Bearer\s*/, "")
                .replace(/^Bearer%20/, "");
        }

        if (!token) {
            console.log("No token found in cookies");
            return res.status(401).json({
                message: "Unauthorized: Token not found in cookies",
                success: false,
            });
        }

        const userId = req.user.userId;
        const modelId = req.params.modelId;

        const user = await User.findById(userId).select("-__v");
        if (!user) {
            return res.status(404).json({
                message: "User not found.",
                success: false,
            });
        }

        if (user.liked_models.includes(modelId)) {
            user.liked_models = user.liked_models.filter(
                (id) => id !== modelId
            );
            const response = await axios.put(
                `http://127.0.0.1:8000/api/v1/trained-model/update-model/${modelId}/`,
                { state: "dislike" },
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.status !== 200) {
                return res.status(500).json({
                    message: "Failed to update model status.",
                    success: false,
                });
            }
            await user.save();
            return res.status(200).json({
                message: "Model removed from liked models.",
                success: true,
            });
        } else {
            user.liked_models.push(modelId);
            const response = await axios.put(
                `http://127.0.0.1:8000/api/v1/trained-model/update-model/${modelId}/`,
                { state: "like" },
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.status !== 200) {
                return res.status(500).json({
                    message: "Failed to update model status.",
                    success: false,
                });
            }
            await user.save();
            return res.status(200).json({
                message: "Model added to liked models.",
                success: true,
            });
        }
    } catch (error) {
        console.log(`Error updating liked model: ${error.message}`);
    }
};
