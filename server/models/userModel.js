const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

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
        created_at: { type: Date, default: Date.now },
        verification_code: { type: String, select: false },
        verification_code_validation: { type: Number, select: false },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("User", userSchema);
