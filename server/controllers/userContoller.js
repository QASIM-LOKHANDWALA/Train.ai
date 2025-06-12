import User from "../models/userModel.js";
import axios from "axios";
import mongoose from "mongoose";

const logger = {
    error: (message) =>
        console.error(`[ERROR] ${new Date().toISOString()} - ${message}`),
    info: (message) =>
        console.log(`[INFO] ${new Date().toISOString()} - ${message}`),
    warn: (message) =>
        console.warn(`[WARN] ${new Date().toISOString()} - ${message}`),
};

const isValidObjectId = (id) => {
    return mongoose.Types.ObjectId.isValid(id);
};

const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

export const profile = asyncHandler(async (req, res) => {
    try {
        // Validate user authentication
        if (!req.user || !req.user.userId) {
            return res.status(401).json({
                message: "Authentication required.",
                success: false,
                error: "UNAUTHORIZED",
            });
        }

        const userId = req.user.userId;

        // Validate ObjectId format
        if (!isValidObjectId(userId)) {
            return res.status(400).json({
                message: "Invalid user ID format.",
                success: false,
                error: "INVALID_USER_ID",
            });
        }

        const user = await User.findById(userId).select("-__v");

        if (!user) {
            logger.warn(
                `Profile fetch attempted for non-existent user: ${userId}`
            );
            return res.status(404).json({
                message: "User not found.",
                success: false,
                error: "USER_NOT_FOUND",
            });
        }

        logger.info(`Profile fetched successfully for user: ${userId}`);
        return res.status(200).json({
            message: "Profile fetched successfully.",
            success: true,
            data: { user },
        });
    } catch (error) {
        logger.error(
            `Error fetching profile for user ${
                req.user?.userId || "unknown"
            }: ${error.message}`
        );

        // Handle specific MongoDB errors
        if (error.name === "CastError") {
            return res.status(400).json({
                message: "Invalid user ID format.",
                success: false,
                error: "INVALID_USER_ID",
            });
        }

        // Handle database connection errors
        if (
            error.name === "MongoNetworkError" ||
            error.name === "MongoTimeoutError"
        ) {
            return res.status(503).json({
                message: "Database connection error. Please try again later.",
                success: false,
                error: "DATABASE_ERROR",
            });
        }

        return res.status(500).json({
            message: "An unexpected error occurred while fetching profile.",
            success: false,
            error: "INTERNAL_SERVER_ERROR",
        });
    }
});

export const setPremium = asyncHandler(async (req, res) => {
    try {
        // Validate user authentication
        if (!req.user || !req.user.userId) {
            return res.status(401).json({
                message: "Authentication required.",
                success: false,
                error: "UNAUTHORIZED",
            });
        }

        const userId = req.user.userId;

        // Validate ObjectId format
        if (!isValidObjectId(userId)) {
            return res.status(400).json({
                message: "Invalid user ID format.",
                success: false,
                error: "INVALID_USER_ID",
            });
        }

        // Find user
        const user = await User.findById(userId).select("-__v");
        if (!user) {
            logger.warn(
                `Premium update attempted for non-existent user: ${userId}`
            );
            return res.status(404).json({
                message: "User not found.",
                success: false,
                error: "USER_NOT_FOUND",
            });
        }

        // Check if user is already premium
        if (user.premium_user === true) {
            return res.status(200).json({
                message: "User is already a premium member.",
                success: true,
                data: {
                    premium_status: true,
                    message: "No changes made",
                },
            });
        }

        // Update premium status
        user.premium_user = true;
        const updatedUser = await user.save();

        if (!updatedUser) {
            throw new Error("Failed to save user premium status");
        }

        logger.info(`Premium status updated successfully for user: ${userId}`);
        return res.status(200).json({
            message: "Premium status updated successfully.",
            success: true,
            data: {
                premium_status: updatedUser.premium_user,
                updated_at: new Date().toISOString(),
            },
        });
    } catch (error) {
        logger.error(
            `Error updating premium status for user ${
                req.user?.userId || "unknown"
            }: ${error.message}`
        );

        // Handle validation errors
        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: "Invalid user data.",
                success: false,
                error: "VALIDATION_ERROR",
                details: Object.values(error.errors).map((err) => err.message),
            });
        }

        // Handle database connection errors
        if (
            error.name === "MongoNetworkError" ||
            error.name === "MongoTimeoutError"
        ) {
            return res.status(503).json({
                message: "Database connection error. Please try again later.",
                success: false,
                error: "DATABASE_ERROR",
            });
        }

        return res.status(500).json({
            message:
                "An unexpected error occurred while updating premium status.",
            success: false,
            error: "INTERNAL_SERVER_ERROR",
        });
    }
});

export const updateLikedModel = asyncHandler(async (req, res) => {
    try {
        // Validate user authentication
        if (!req.user || !req.user.userId) {
            return res.status(401).json({
                message: "Authentication required.",
                success: false,
                error: "UNAUTHORIZED",
            });
        }

        const userId = req.user.userId;
        const modelId = req.params.modelId;
        const token = req.headers.authorization?.split(" ")[1];

        // Validate required parameters
        if (!modelId) {
            return res.status(400).json({
                message: "Model ID is required.",
                success: false,
                error: "MISSING_MODEL_ID",
            });
        }

        // Validate ObjectId formats
        if (!isValidObjectId(userId)) {
            return res.status(400).json({
                message: "Invalid user ID format.",
                success: false,
                error: "INVALID_USER_ID",
            });
        }

        // Validate authorization token
        if (!token) {
            return res.status(401).json({
                message: "Authorization token is required.",
                success: false,
                error: "MISSING_AUTH_TOKEN",
            });
        }

        // Find user
        const user = await User.findById(userId).select("-__v");
        if (!user) {
            logger.warn(
                `Like update attempted for non-existent user: ${userId}`
            );
            return res.status(404).json({
                message: "User not found.",
                success: false,
                error: "USER_NOT_FOUND",
            });
        }

        // Initialize liked_models array if it doesn't exist
        if (!Array.isArray(user.liked_models)) {
            user.liked_models = [];
        }

        // Determine like/dislike action
        const alreadyLiked = user.liked_models.includes(modelId);
        const state = alreadyLiked ? "dislike" : "like";
        const updatedModels = alreadyLiked
            ? user.liked_models.filter((id) => id !== modelId)
            : [...user.liked_models, modelId];

        // Prepare axios request with timeout and proper error handling
        const axiosConfig = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            timeout: 10000,
            validateStatus: function (status) {
                return status < 500;
            },
        };

        let externalApiResponse;
        try {
            const apiUrl = `${
                process.env.ML_API_BASE_URL || "http://127.0.0.1:8000"
            }/api/v1/trained-model/update-model/${modelId}/`;

            externalApiResponse = await axios.put(
                apiUrl,
                { state },
                axiosConfig
            );

            if (externalApiResponse.status === 404) {
                return res.status(404).json({
                    message: "Model not found on the ML service.",
                    success: false,
                    error: "MODEL_NOT_FOUND",
                });
            }

            if (
                externalApiResponse.status === 401 ||
                externalApiResponse.status === 403
            ) {
                return res.status(403).json({
                    message: "You don't have permission to modify this model.",
                    success: false,
                    error: "PERMISSION_DENIED",
                });
            }

            if (externalApiResponse.status >= 400) {
                logger.error(
                    `ML API returned error ${
                        externalApiResponse.status
                    }: ${JSON.stringify(externalApiResponse.data)}`
                );
                return res.status(400).json({
                    message: "Failed to update model status on ML service.",
                    success: false,
                    error: "EXTERNAL_API_ERROR",
                    details:
                        externalApiResponse.data?.message ||
                        "Unknown error from ML service",
                });
            }
        } catch (apiError) {
            logger.error(
                `Error calling ML API for model ${modelId}: ${apiError.message}`
            );

            if (apiError.code === "ECONNREFUSED") {
                return res.status(503).json({
                    message:
                        "ML service is currently unavailable. Please try again later.",
                    success: false,
                    error: "SERVICE_UNAVAILABLE",
                });
            }

            if (
                apiError.code === "ETIMEDOUT" ||
                apiError.code === "ECONNABORTED"
            ) {
                return res.status(504).json({
                    message:
                        "Request to ML service timed out. Please try again.",
                    success: false,
                    error: "SERVICE_TIMEOUT",
                });
            }

            if (apiError.response) {
                return res.status(502).json({
                    message: "ML service returned an error.",
                    success: false,
                    error: "EXTERNAL_API_ERROR",
                    details:
                        apiError.response.data?.message ||
                        "Unknown error from ML service",
                });
            }

            return res.status(503).json({
                message:
                    "Unable to connect to ML service. Please try again later.",
                success: false,
                error: "SERVICE_CONNECTION_ERROR",
            });
        }

        try {
            user.liked_models = updatedModels;
            const savedUser = await user.save();

            if (!savedUser) {
                throw new Error("Failed to save user liked models");
            }

            logger.info(
                `Successfully ${state}d model ${modelId} for user ${userId}`
            );

            return res.status(200).json({
                message: `Model ${
                    state === "like" ? "added to" : "removed from"
                } liked models successfully.`,
                success: true,
                data: {
                    user: savedUser,
                    action: state,
                    model_id: modelId,
                    total_liked_models: savedUser.liked_models.length,
                },
            });
        } catch (saveError) {
            logger.error(
                `Error saving user liked models for user ${userId}: ${saveError.message}`
            );
            try {
                const rollbackState = state === "like" ? "dislike" : "like";
                await axios.put(
                    `${
                        process.env.ML_API_BASE_URL || "http://127.0.0.1:8000"
                    }/api/v1/trained-model/update-model/${modelId}/`,
                    { state: rollbackState },
                    axiosConfig
                );
                logger.info(`Rollback successful for model ${modelId}`);
            } catch (rollbackError) {
                logger.error(
                    `Rollback failed for model ${modelId}: ${rollbackError.message}`
                );
            }

            return res.status(500).json({
                message:
                    "Failed to save liked model status. The operation has been rolled back.",
                success: false,
                error: "DATABASE_SAVE_ERROR",
            });
        }
    } catch (error) {
        logger.error(
            `Unexpected error in updateLikedModel for user ${
                req.user?.userId || "unknown"
            }, model ${req.params?.modelId || "unknown"}: ${error.message}`
        );

        if (error.name === "CastError") {
            return res.status(400).json({
                message: "Invalid ID format provided.",
                success: false,
                error: "INVALID_ID_FORMAT",
            });
        }

        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: "Invalid user data.",
                success: false,
                error: "VALIDATION_ERROR",
                details: Object.values(error.errors).map((err) => err.message),
            });
        }

        if (
            error.name === "MongoNetworkError" ||
            error.name === "MongoTimeoutError"
        ) {
            return res.status(503).json({
                message: "Database connection error. Please try again later.",
                success: false,
                error: "DATABASE_ERROR",
            });
        }

        return res.status(500).json({
            message: "An unexpected error occurred while updating liked model.",
            success: false,
            error: "INTERNAL_SERVER_ERROR",
        });
    }
});

export const errorHandler = (err, req, res, next) => {
    logger.error(`Unhandled error: ${err.message}`);
    logger.error(`Stack trace: ${err.stack}`);

    return res.status(500).json({
        message: "An unexpected server error occurred.",
        success: false,
        error: "INTERNAL_SERVER_ERROR",
    });
};
