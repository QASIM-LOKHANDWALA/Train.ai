import User from "../models/userModel.js";
import bcrypt from "bcrypt";

const hashPassword = async (value, salt) => {
    const result = await bcrypt.hash(value, salt);
    return result;
};

export const signup = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required.",
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
        });
        const result = await newUser.save();
        result.password = undefined;

        res.status(201).json({
            message: "Account created successfully.",
            success: true,
            user: result,
        });
    } catch (error) {
        console.log(`Error during signup: ${error.message}`);
    }
};
