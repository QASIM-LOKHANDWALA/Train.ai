import React, { useState, useEffect } from "react";
import {
    Brain,
    Calendar,
    BarChart3,
    TrendingUp,
    Eye,
    Heart,
    Play,
    ChevronLeft,
    ChevronRight,
    Target,
    Layers,
    Activity,
} from "lucide-react";

const ModelDetail = () => {
    const [modelData, setModelData] = useState({
        id: "4b614db5-7e0b-4505-9d21-0e0e066d7f3c",
        user_id: "684409860c5160561c544b06",
        model_name: "Trial run after updated code",
        model_type: "DecisionTree",
        polynomial_degree: null,
        target_column: "Outcome",
        features:
            "Pregnancies,Glucose,BloodPressure,SkinThickness,Insulin,BMI,DiabetesPedigreeFunction,Age",
        model_file:
            "/media/models/4b614db5-7e0b-4505-9d21-0e0e066d7f3c_model.pkl",
        created_at: "2025-06-08T09:35:54.004148Z",
        is_public: true,
        likes: 1,
        stats: {
            id: 1,
            trained_model: "4b614db5-7e0b-4505-9d21-0e0e066d7f3c",
            r2_score: null,
            mse: null,
            mae: null,
            accuracy: 0.7922077922077922,
            precision: 0.7788824816066813,
            recall: 0.7575757575757576,
            f1_score: 0.7654673519893394,
        },
        graphs: [
            {
                id: 1,
                trained_model: "4b614db5-7e0b-4505-9d21-0e0e066d7f3c",
                title: "Confusion Matrix",
                description: "Shows TP, FP, FN, TN",
                graph_image:
                    "/media/graphs/cm_4b614db5-7e0b-4505-9d21-0e0e066d7f3c_I14oO2y.png",
                graph_json: null,
            },
            {
                id: 2,
                trained_model: "4b614db5-7e0b-4505-9d21-0e0e066d7f3c",
                title: "ROC Curve",
                description: "Shows model's ability to distinguish classes",
                graph_image:
                    "/media/graphs/roc_4b614db5-7e0b-4505-9d21-0e0e066d7f3c_irxkb5h.png",
                graph_json: null,
            },
            {
                id: 3,
                trained_model: "4b614db5-7e0b-4505-9d21-0e0e066d7f3c",
                title: "Precision-Recall Curve",
                description: "Shows trade-off between precision and recall",
                graph_image:
                    "/media/graphs/pr_4b614db5-7e0b-4505-9d21-0e0e066d7f3c_E9C1jyD.png",
                graph_json: null,
            },
        ],
    });

    const DJANGO_BASE_URL = "http://localhost:8000";

    const [currentGraphIndex, setCurrentGraphIndex] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(modelData.likes);
    const [imageError, setImageError] = useState(false);

    const isClassification = modelData.stats.accuracy !== null;
    const isRegression = modelData.stats.r2_score !== null;

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const formatPercentage = (value) => {
        return `${(value * 100).toFixed(2)}%`;
    };

    const formatNumber = (value) => {
        return Number(value).toFixed(4);
    };

    const handleLike = () => {
        setIsLiked(!isLiked);
        setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
    };

    const nextGraph = () => {
        setCurrentGraphIndex((prev) =>
            prev === modelData.graphs.length - 1 ? 0 : prev + 1
        );
        setImageError(false);
    };

    const prevGraph = () => {
        setCurrentGraphIndex((prev) =>
            prev === 0 ? modelData.graphs.length - 1 : prev - 1
        );
        setImageError(false);
    };

    const handleImageError = () => {
        setImageError(true);
    };

    const renderClassificationStats = () => (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700">
                <div className="flex items-center justify-between mb-2">
                    <Target className="w-6 h-6 text-yellow-500" />
                    <span className="text-2xl font-bold text-white">
                        {formatPercentage(modelData.stats.accuracy)}
                    </span>
                </div>
                <p className="text-gray-400 text-sm">Accuracy</p>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700">
                <div className="flex items-center justify-between mb-2">
                    <Activity className="w-6 h-6 text-orange-500" />
                    <span className="text-2xl font-bold text-white">
                        {formatPercentage(modelData.stats.precision)}
                    </span>
                </div>
                <p className="text-gray-400 text-sm">Precision</p>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700">
                <div className="flex items-center justify-between mb-2">
                    <TrendingUp className="w-6 h-6 text-yellow-500" />
                    <span className="text-2xl font-bold text-white">
                        {formatPercentage(modelData.stats.recall)}
                    </span>
                </div>
                <p className="text-gray-400 text-sm">Recall</p>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700">
                <div className="flex items-center justify-between mb-2">
                    <BarChart3 className="w-6 h-6 text-orange-500" />
                    <span className="text-2xl font-bold text-white">
                        {formatPercentage(modelData.stats.f1_score)}
                    </span>
                </div>
                <p className="text-gray-400 text-sm">F1 Score</p>
            </div>
        </div>
    );

    const renderRegressionStats = () => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700">
                <div className="flex items-center justify-between mb-2">
                    <Target className="w-6 h-6 text-yellow-500" />
                    <span className="text-2xl font-bold text-white">
                        {formatNumber(modelData.stats.r2_score)}
                    </span>
                </div>
                <p className="text-gray-400 text-sm">R² Score</p>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700">
                <div className="flex items-center justify-between mb-2">
                    <Activity className="w-6 h-6 text-orange-500" />
                    <span className="text-2xl font-bold text-white">
                        {formatNumber(modelData.stats.mse)}
                    </span>
                </div>
                <p className="text-gray-400 text-sm">MSE</p>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700">
                <div className="flex items-center justify-between mb-2">
                    <BarChart3 className="w-6 h-6 text-yellow-500" />
                    <span className="text-2xl font-bold text-white">
                        {formatNumber(modelData.stats.mae)}
                    </span>
                </div>
                <p className="text-gray-400 text-sm">MAE</p>
            </div>
        </div>
    );

    const currentGraph = modelData.graphs[currentGraphIndex];

    return (
        <div className="min-h-screen bg-gradient-to-br from-rich-black-300 via-rich-black-400 to-raisin-black-300">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-dark-orange-500/20 to-goldenrod-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-goldenrod-500/15 to-dark-orange-500/15 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-dark-orange-500/5 to-goldenrod-500/5 rounded-full blur-3xl"></div>
            s
            <div className="relative max-w-7xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <button className="flex items-center text-gray-400 hover:text-gray-300 mb-6 transition-colors duration-200">
                        <ChevronLeft className="w-5 h-5 mr-2" />
                        Back to Models
                    </button>

                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center">
                                    <Brain className="w-6 h-6 text-gray-900" />
                                </div>
                                <div>
                                    <h1 className="text-3xl md:text-4xl font-bold text-white">
                                        {modelData.model_name}
                                    </h1>
                                    <div className="flex items-center gap-4 text-gray-400 text-sm">
                                        <span className="flex items-center gap-1">
                                            <Layers className="w-4 h-4" />
                                            {modelData.model_type}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            {formatDate(modelData.created_at)}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Eye className="w-4 h-4" />
                                            {modelData.is_public
                                                ? "Public"
                                                : "Private"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mb-4">
                                <span className="px-3 py-1 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 text-yellow-500 rounded-full text-sm font-medium border border-yellow-500/30">
                                    {isClassification
                                        ? "Classification"
                                        : "Regression"}
                                </span>
                                <span className="px-3 py-1 bg-gradient-to-r from-slate-800 to-slate-900 text-gray-400 rounded-full text-sm border border-slate-700">
                                    Target: {modelData.target_column}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleLike}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                                    isLiked
                                        ? "bg-gradient-to-r from-orange-500 to-yellow-500 text-gray-900"
                                        : "bg-gradient-to-r from-slate-800 to-slate-900 text-gray-400 hover:text-gray-300 border border-slate-700"
                                }`}
                            >
                                <Heart
                                    className={`w-5 h-5 ${
                                        isLiked ? "fill-current" : ""
                                    }`}
                                />
                                {likeCount}
                            </button>

                            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-gray-900 rounded-xl hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-200">
                                <Play className="w-5 h-5" />
                                Test Model
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8 mb-8">
                    <div className="lg:col-span-1">
                        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700 h-full">
                            <h2 className="text-xl font-bold text-white mb-6">
                                Model Information
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-gray-400 text-sm font-medium mb-2">
                                        Features Used
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {modelData.features
                                            .split(",")
                                            .map((feature, index) => (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1 bg-gradient-to-r from-gray-800 to-slate-800 text-gray-300 rounded-lg text-sm border border-slate-700"
                                                >
                                                    {feature.trim()}
                                                </span>
                                            ))}
                                    </div>
                                </div>

                                {modelData.polynomial_degree && (
                                    <div>
                                        <h3 className="text-gray-400 text-sm font-medium mb-2">
                                            Polynomial Degree
                                        </h3>
                                        <span className="px-3 py-1 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-500 rounded-lg text-sm border border-yellow-500/30">
                                            {modelData.polynomial_degree}
                                        </span>
                                    </div>
                                )}

                                <div>
                                    <h3 className="text-gray-400 text-sm font-medium mb-2">
                                        Model ID
                                    </h3>
                                    <p className="text-gray-300 text-sm font-mono bg-gradient-to-r from-gray-800 to-slate-800 p-3 rounded-lg border border-slate-700 break-all">
                                        {modelData.id}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700">
                            <h2 className="text-xl font-bold text-white mb-6">
                                Performance Metrics
                            </h2>
                            {isClassification
                                ? renderClassificationStats()
                                : renderRegressionStats()}
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-white">
                            Model Visualizations
                        </h2>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={prevGraph}
                                className="p-2 bg-gradient-to-r from-slate-700 to-slate-800 text-gray-400 hover:text-gray-300 rounded-lg transition-colors duration-200 border border-slate-600"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <span className="text-gray-400 text-sm">
                                {currentGraphIndex + 1} /{" "}
                                {modelData.graphs.length}
                            </span>
                            <button
                                onClick={nextGraph}
                                className="p-2 bg-gradient-to-r from-slate-700 to-slate-800 text-gray-400 hover:text-gray-300 rounded-lg transition-colors duration-200 border border-slate-600"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8">
                        <div className="relative">
                            <div className="bg-gradient-to-br from-gray-800 to-slate-800 rounded-xl p-4 border border-slate-700 aspect-square">
                                {!imageError ? (
                                    <img
                                        src={`${DJANGO_BASE_URL}${currentGraph?.graph_image}`}
                                        alt={currentGraph?.title}
                                        className={`w-full h-full object-contain rounded-lg transition-transform duration-200`}
                                        onError={handleImageError}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <BarChart3 className="w-8 h-8 text-gray-900" />
                                            </div>
                                            <p className="text-gray-400 text-sm">
                                                Graph image not available
                                            </p>
                                            <p className="text-gray-500 text-xs mt-1">
                                                {currentGraph?.title}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2">
                                    {currentGraph?.title}
                                </h3>
                                <p className="text-gray-400 mb-4">
                                    {currentGraph?.description}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                {modelData.graphs.map((graph, index) => (
                                    <button
                                        key={graph.id}
                                        onClick={() => {
                                            setCurrentGraphIndex(index);
                                            setImageError(false);
                                        }}
                                        className={`relative p-3 rounded-lg transition-all duration-200 ${
                                            currentGraphIndex === index
                                                ? "bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border-2 border-orange-500/50"
                                                : "bg-gradient-to-r from-gray-800 to-slate-800 border border-slate-700 hover:border-slate-600"
                                        }`}
                                    >
                                        <div className="aspect-square bg-gradient-to-br from-slate-700 to-slate-800 rounded flex items-center justify-center overflow-hidden">
                                            <img
                                                src={`${DJANGO_BASE_URL}${graph.graph_image}`}
                                                alt={graph.title}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.style.display =
                                                        "none";
                                                    e.target.nextSibling.style.display =
                                                        "flex";
                                                }}
                                            />
                                            <div className="w-full h-full items-center justify-center hidden">
                                                <BarChart3 className="w-6 h-6 text-gray-400" />
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-400 mt-2 truncate">
                                            {graph.title}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModelDetail;
