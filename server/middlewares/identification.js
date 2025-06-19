import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const logger = {
    error: (message) =>
        console.error(`[ERROR] ${new Date().toISOString()} - ${message}`),
    info: (message) =>
        console.log(`[INFO] ${new Date().toISOString()} - ${message}`),
    warn: (message) =>
        console.warn(`[WARN] ${new Date().toISOString()} - ${message}`),
};

export const identifier = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(403).json({
            message: "Unauthorized: No token provided",
            success: false,
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;

        logger.info(`Authenticated User: ${req.user}`);

        next();
    } catch (error) {
        console.error(`Token verification failed: ${error.message}`);
        return res.status(403).json({
            message: "Unauthorized: Invalid token",
            success: false,
        });
    }
};
