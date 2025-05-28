import User from "../models/userModel.js";

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
