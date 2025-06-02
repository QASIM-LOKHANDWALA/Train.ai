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

export const signup = async (req, res) => {
    const { email, password, full_name } = req.body;
    console.log(`Received signup request for email: ${email}`);

    try {
        if (!email || !password || !full_name) {
            return res.status(400).json({
                message: "All fields are required.",
                success: false,
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists.",
                success: false,
            });
        }

        const hashedPassword = await hashPassword(password, 12);
        const newUser = new User({
            email,
            password: hashedPassword,
            full_name,
        });
        const result = await newUser.save();
        result.password = undefined;

        console.log(`New user created: ${result.email}`);

        res.status(201).json({
            message: "Account created successfully.",
            success: true,
            user: result,
        });
    } catch (error) {
        console.log(`Error during signup: ${error.message}`);
    }
};

export const signin = async (req, res) => {
    const { email, password } = req.body;
    console.log(`Received signin request for email: ${email}`);

    try {
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required.",
                success: false,
            });
        }

        const existingUser = await User.findOne({ email }).select("+password");
        if (!existingUser) {
            return res.status(400).json({
                message: "User does not exist.",
                success: false,
            });
        }

        const result = await checkPassword(password, existingUser.password);
        if (!result) {
            return res.status(400).json({
                message: "Invalid credentials.",
                success: false,
            });
        }

        const userObj = existingUser.toObject();
        delete userObj.password;

        console.log(`User logged in: ${userObj.email}`);

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
        res.cookie("Authorization", "Bearer " + token, {
            expires: new Date(Date.now() + 8 * 3600000),
            httpOnly: process.env.NODE_ENV === "production",
            secure: process.env.NODE_ENV === "production",
        }).json({
            message: "Logged in successfully.",
            success: true,
            user: userObj,
            token,
        });
    } catch (error) {
        console.log(`Error during signup: ${error.message}`);
    }
};

export const signout = async (req, res) => {
    res.clearCookie("Authorization").status(200).json({
        message: "Logged out successfully.",
        success: true,
    });
};
