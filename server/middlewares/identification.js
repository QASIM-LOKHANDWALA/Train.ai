import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

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
        console.log("Authenticated User:", req.user);
        next();
    } catch (error) {
        console.error(`Token verification failed: ${error.message}`);
        return res.status(403).json({
            message: "Unauthorized: Invalid token",
            success: false,
        });
    }
};
