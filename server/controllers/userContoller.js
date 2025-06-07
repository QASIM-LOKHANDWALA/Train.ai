import User from "../models/userModel.js";
import axios from "axios";

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
        const userId = req.user.userId;
        const token = req.headers.authorization?.split(" ")[1];
        const modelId = req.params.modelId;

        const user = await User.findById(userId).select("-__v");
        if (!user) {
            return res
                .status(404)
                .json({ message: "User not found.", success: false });
        }

        const alreadyLiked = user.liked_models.includes(modelId);
        const state = alreadyLiked ? "dislike" : "like";
        const updatedModels = alreadyLiked
            ? user.liked_models.filter((id) => id !== modelId)
            : [...user.liked_models, modelId];

        user.liked_models = updatedModels;

        const response = await axios.put(
            `http://127.0.0.1:8000/api/v1/trained-model/update-model/${modelId}/`,
            { state },
            {
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
            message: `Model ${
                state === "like" ? "added to" : "removed from"
            } liked models.`,
            success: true,
        });
    } catch (error) {
        console.log(`Error updating liked model: ${error.message}`);
        return res
            .status(500)
            .json({ message: "Server error", success: false });
    }
};
