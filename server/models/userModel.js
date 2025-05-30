import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            unique: [true, "Email must be unique!"],
            required: [true, "Email is required!"],
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: [true, "Password is required!"],
            trim: true,
            select: false,
        },
        full_name: { type: String },
        limit: { type: Number, default: 20 },
        premium_user: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("User", userSchema);
