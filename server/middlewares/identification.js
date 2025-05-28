import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const identifier = (req, res, next) => {
    let token;
    if (req.headers.client === "not-browser") {
        token = req.headers.authorization;
    } else {
        token = req.cookies["Authorization"];
    }

    if (!token) {
        return res.status(403).json({
            message: "Unauthorized",
            success: false,
        });
    }

    try {
        const userToken = token.split(" ")[1];
        const verified = jwt.verify(userToken, process.env.TOKEN_SECRET);

        if (verified) {
            req.user = verified;
            next();
        }
        // throw new Error("Token verification failed");
    } catch (error) {
        console.log(`Error during identification: ${error.message}`);
    }
};
