import React, { useState } from "react";
import {
    LuHeart,
    LuEye,
    LuCalendar,
    LuTrendingUp,
    LuDatabase,
    LuGrid3X3,
    LuChevronDown,
    LuChevronUp,
} from "react-icons/lu";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const ModelCard = ({ model }) => {
    const { user, updateLike } = useAuth();
    const [isLiked, setIsLiked] = useState(
        user.liked_models.includes(model.id)
    );
    const [modelLikes, setModelLikes] = useState(model.likes);
    const [showAllFeatures, setShowAllFeatures] = useState(false);

    const handleLike = async () => {
        try {
            await updateLike(model.id).unwrap();
            setIsLiked((prev) => !prev);
            setModelLikes(isLiked ? modelLikes - 1 : modelLikes + 1);
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
            RandomForest: "from-indigo-500 to-purple-500",
            SVM: "from-orange-500 to-red-500",
            NaiveBayes: "from-teal-500 to-blue-500",
        };
        return colors[type] || "from-gray-500 to-gray-600";
    };

    const renderFeaturesWithToggle = () => {
        const features = model.features ? model.features.split(",") : [];
        const maxVisibleFeatures = 3;
        const shouldShowToggle = features.length > maxVisibleFeatures;
        const visibleFeatures = showAllFeatures
            ? features
            : features.slice(0, maxVisibleFeatures);

        return (
            <div className="flex flex-col">
                <div className="flex flex-wrap gap-1 mb-2">
                    {visibleFeatures.map((feature, index) => (
                        <span
                            key={index}
                            className="px-2 py-1 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded-md transition-colors duration-200 cursor-default"
                            title={feature.trim()}
                        >
                            {feature.trim()}
                        </span>
                    ))}
                </div>
                {shouldShowToggle && (
                    <button
                        onClick={() => setShowAllFeatures(!showAllFeatures)}
                        className="flex items-center gap-1 text-orange-400 hover:text-orange-300 text-xs font-medium transition-colors duration-200 self-start mt-1"
                    >
                        {showAllFeatures ? (
                            <>
                                <LuChevronUp className="w-3 h-3" />
                                Show Less
                            </>
                        ) : (
                            <>
                                <LuChevronDown className="w-3 h-3" />+
                                {features.length - maxVisibleFeatures} More
                            </>
                        )}
                    </button>
                )}
            </div>
        );
    };

    const getPerformanceIndicator = () => {
        const performanceColors = {
            excellent: "bg-green-500",
            good: "bg-yellow-500",
            fair: "bg-orange-500",
            poor: "bg-red-500",
        };

        let performance = "fair";
        let displayMetric = "";

        if (model.stats) {
            if (
                model.stats.accuracy !== null &&
                model.stats.accuracy !== undefined
            ) {
                const accuracy = model.stats.accuracy;
                displayMetric = `${(accuracy * 100).toFixed(1)}%`;

                if (accuracy >= 0.9) performance = "excellent";
                else if (accuracy >= 0.8) performance = "good";
                else if (accuracy >= 0.7) performance = "fair";
                else performance = "poor";
            } else if (
                model.stats.r2_score !== null &&
                model.stats.r2_score !== undefined
            ) {
                const r2Score = model.stats.r2_score;
                displayMetric = `R²: ${r2Score.toFixed(3)}`;

                if (r2Score >= 0.8) performance = "excellent";
                else if (r2Score >= 0.6) performance = "good";
                else if (r2Score >= 0.4) performance = "fair";
                else performance = "poor";
            } else if (
                model.stats.mae !== null &&
                model.stats.mae !== undefined
            ) {
                const mae = model.stats.mae;
                displayMetric = `MAE: ${mae.toFixed(2)}`;

                if (mae <= 10) performance = "excellent";
                else if (mae <= 50) performance = "good";
                else if (mae <= 100) performance = "fair";
                else performance = "poor";
            }
        }

        return (
            <div
                className="flex items-center gap-2"
                title={`Performance: ${performance}${
                    displayMetric ? ` (${displayMetric})` : ""
                }`}
            >
                <div
                    className={`w-2 h-2 rounded-full ${performanceColors[performance]} animate-pulse`}
                ></div>
                <span className="text-xs text-gray-400 capitalize">
                    {performance}
                </span>
                {displayMetric && (
                    <span className="text-xs text-gray-500 hidden lg:inline">
                        {displayMetric}
                    </span>
                )}
            </div>
        );
    };

    return (
        <div className="group bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl p-4 sm:p-6 border border-gray-600 hover:border-orange-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/10 hover:-translate-y-1">
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0 pr-3">
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors line-clamp-2 break-words">
                        {model.model_name}
                    </h3>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                        <div
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getModelTypeColor(
                                model.model_type
                            )} text-white w-fit`}
                        >
                            <LuTrendingUp className="w-3 h-3 mr-1 flex-shrink-0" />
                            <span className="truncate">
                                {getModelTypeDisplay(model.model_type)}
                            </span>
                        </div>
                        <div className="hidden sm:block">
                            {getPerformanceIndicator()}
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleLike}
                    className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-all duration-200 group-hover:scale-110 flex-shrink-0"
                    title={isLiked ? "Unlike this model" : "Like this model"}
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
                    <LuDatabase className="w-4 h-4 text-yellow-500 mr-2 flex-shrink-0" />
                    <span className="text-gray-400">Target:</span>
                    <span className="text-white ml-2 font-medium truncate">
                        {model.target_column}
                    </span>
                </div>

                <div className="flex text-sm">
                    <div className="flex items-start">
                        <LuGrid3X3 className="w-4 h-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-400">Features:</span>
                    </div>
                    <div className="ml-2 flex-1 min-w-0">
                        {renderFeaturesWithToggle()}
                    </div>
                </div>

                <div className="block sm:hidden">
                    {getPerformanceIndicator()}
                </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-gray-600">
                <div className="flex items-center justify-between sm:justify-start sm:gap-4">
                    <div className="flex items-center text-sm text-gray-400">
                        <LuCalendar className="w-4 h-4 mr-1 flex-shrink-0" />
                        <span className="truncate">
                            {formatDate(model.created_at)}
                        </span>
                    </div>

                    <div className="flex items-center text-sm text-gray-400">
                        <LuHeart className="w-4 h-4 mr-1 flex-shrink-0" />
                        <span>{modelLikes}</span>
                    </div>
                </div>

                <Link
                    to={`/model-detail/${model.id}`}
                    className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-gray-900 text-sm font-medium rounded-full hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-200 hover:scale-105 group/link w-full sm:w-auto"
                >
                    <LuEye className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>View Details</span>
                </Link>
            </div>

            <div className="hidden lg:block opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-4 pt-4 border-t border-gray-600/50">
                <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                        <span className="text-gray-500">Model ID:</span>
                        <p
                            className="text-gray-300 font-mono truncate"
                            title={model.id}
                        >
                            {model.id.slice(0, 8)}...
                        </p>
                    </div>
                    <div>
                        <span className="text-gray-500">Status:</span>
                        <p className="text-green-400 font-medium">Trained</p>
                    </div>
                </div>
            </div>

            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-yellow-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        </div>
    );
};

export default ModelCard;
