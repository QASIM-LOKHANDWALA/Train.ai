import React, { useState } from "react";
import {
    LuHeart,
    LuEye,
    LuCalendar,
    LuTrendingUp,
    LuDatabase,
    LuGrid3X3,
} from "react-icons/lu";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";

const ModelCard = ({ model }) => {
    const { user } = useAuth();
    const [isLiked, setIsLiked] = useState(
        user.liked_models.includes(model.id)
    );

    const handleLike = async () => {
        try {
            const token = localStorage.getItem("token");
            console.log(token);

            const response = await axios.get(
                `http://127.0.0.1:5050/api/v1/user/update-liked-model/${model.id}`,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log(response);

            if (response.data.success) {
                console.log("Like Updated");
            }
        } catch (error) {
            console.log(`Error In Updating Likes: ${error.message}`);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const getModelTypeDisplay = (type) => {
        return type.replace(/([A-Z])/g, " $1").trim();
    };

    const getModelTypeColor = (type) => {
        const colors = {
            PolynomialRegression: "from-blue-500 to-cyan-500",
            LinearRegression: "from-green-500 to-emerald-500",
            DecisionTree: "from-purple-500 to-violet-500",
            KNN: "from-red-500 to-pink-500",
        };
        return colors[type] || "from-gray-500 to-gray-600";
    };

    return (
        <div className="group bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl p-6 border border-gray-600 hover:border-orange-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/10 hover:-translate-y-1">
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">
                        {model.model_name}
                    </h3>
                    <div
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getModelTypeColor(
                            model.model_type
                        )} text-white`}
                    >
                        <LuTrendingUp className="w-3 h-3 mr-1" />
                        {getModelTypeDisplay(model.model_type)}
                    </div>
                </div>

                <button
                    onClick={handleLike}
                    className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors group-hover:scale-110"
                >
                    <LuHeart
                        className={`w-4 h-4 transition-colors ${
                            isLiked
                                ? "text-red-500 fill-red-500"
                                : "text-gray-400 hover:text-red-400"
                        }`}
                    />
                </button>
            </div>

            <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm">
                    <LuDatabase className="w-4 h-4 text-yellow-500 mr-2" />
                    <span className="text-gray-400">Target:</span>
                    <span className="text-white ml-2 font-medium">
                        {model.target_column}
                    </span>
                </div>

                <div className="flex items-start text-sm">
                    <LuGrid3X3 className="w-4 h-4 text-yellow-500 mr-2 mt-0.5" />
                    <span className="text-gray-400">Features:</span>
                    <div className="ml-2 flex flex-wrap gap-1">
                        {model.features.split(",").map((feature, index) => (
                            <span
                                key={index}
                                className="px-2 py-1 bg-gray-700 text-white text-xs rounded-md"
                            >
                                {feature.trim()}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-600">
                <div className="flex items-center text-sm text-gray-400">
                    <LuCalendar className="w-4 h-4 mr-1" />
                    {formatDate(model.created_at)}
                </div>

                <div className="flex items-center space-x-3">
                    <div className="flex items-center text-sm text-gray-400">
                        <LuHeart className="w-4 h-4 mr-1" />
                        {model.likes}
                    </div>

                    <button className="flex items-center px-3 py-1 bg-gradient-to-r from-orange-500 to-yellow-500 text-gray-900 text-sm font-medium rounded-full hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-200">
                        <LuEye className="w-4 h-4 mr-1" />
                        View
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModelCard;
