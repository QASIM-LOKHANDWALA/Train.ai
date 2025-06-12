import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const hashPassword = async (value, salt) => {
    const result = await bcrypt.hash(value, salt);
    return result;
};

const checkPassword = async (value, hashedValue) => {
    const result = await bcrypt.compare(value, hashedValue);
    return result;
};

// Simple email validation
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const signup = async (req, res) => {
    try {
        const { email, password, full_name } = req.body;
        console.log(`Received signup request for email: ${email}`);

        // Validate required fields
        if (!email || !password || !full_name) {
            return res.status(400).json({
                message: "All fields are required.",
                success: false,
            });
        }

        // Validate email format
        if (!isValidEmail(email)) {
            return res.status(400).json({
                message: "Please provide a valid email address.",
                success: false,
            });
        }

        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters long.",
                success: false,
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists with this email.",
                success: false,
            });
        }

        // Hash password and create user
        const hashedPassword = await hashPassword(password, 12);
        const newUser = new User({
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            full_name: full_name.trim(),
        });

        const result = await newUser.save();
        result.password = undefined;

        console.log(`New user created: ${result.email}`);

        return res.status(201).json({
            message: "Account created successfully.",
            success: true,
            user: result,
        });
    } catch (error) {
        console.log(`Error during signup: ${error.message}`);

        if (error.code === 11000) {
            return res.status(400).json({
                message: "User already exists with this email.",
                success: false,
            });
        }

        // Handle validation errors
        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: "Invalid user data provided.",
                success: false,
            });
        }

        return res.status(500).json({
            message: "Something went wrong. Please try again.",
            success: false,
        });
    }
};

export const signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(`Received signin request for email: ${email}`);

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required.",
                success: false,
            });
        }

        // Validate email format
        if (!isValidEmail(email)) {
            return res.status(400).json({
                message: "Please provide a valid email address.",
                success: false,
            });
        }

        // Check if JWT secret is configured
        if (!process.env.TOKEN_SECRET) {
            console.error("TOKEN_SECRET environment variable is not set");
            return res.status(500).json({
                message: "Server configuration error.",
                success: false,
            });
        }

        // Find user and include password for comparison
        const existingUser = await User.findOne({
            email: email.toLowerCase().trim(),
        }).select("+password");

        if (!existingUser) {
            return res.status(400).json({
                message: "Invalid email or password.",
                success: false,
            });
        }

        // Check password
        const result = await checkPassword(password, existingUser.password);
        if (!result) {
            return res.status(400).json({
                message: "Invalid email or password.",
                success: false,
            });
        }

        // Create user object without password
        const userObj = existingUser.toObject();
        delete userObj.password;

        console.log(`User logged in: ${userObj.email}`);

        // Generate JWT token
        const token = jwt.sign(
            {
                userId: existingUser._id,
                email: existingUser.email,
            },
            process.env.TOKEN_SECRET,
            {
                expiresIn: "8h",
            }
        );

        // Set cookie and send response
        return res
            .cookie("Authorization", "Bearer " + token, {
                expires: new Date(Date.now() + 8 * 3600000),
                httpOnly: process.env.NODE_ENV === "production",
                secure: process.env.NODE_ENV === "production",
            })
            .json({
                message: "Logged in successfully.",
                success: true,
                user: userObj,
                token,
            });
    } catch (error) {
        console.log(`Error during signin: ${error.message}`);

        // Handle JWT errors
        if (error.name === "JsonWebTokenError") {
            return res.status(500).json({
                message: "Token generation failed.",
                success: false,
            });
        }

        // Handle database connection errors
        if (error.name === "MongoNetworkError") {
            return res.status(503).json({
                message: "Database connection error. Please try again.",
                success: false,
            });
        }

        return res.status(500).json({
            message: "Something went wrong. Please try again.",
            success: false,
        });
    }
};

export const signout = async (req, res) => {
    try {
        res.clearCookie("Authorization").status(200).json({
            message: "Logged out successfully.",
            success: true,
        });
    } catch (error) {
        console.log(`Error during signout: ${error.message}`);
        return res.status(500).json({
            message: "Error during logout. Please try again.",
            success: false,
        });
    }
};
