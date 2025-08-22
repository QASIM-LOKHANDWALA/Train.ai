import React, { useState, useEffect } from "react";
import {
    Brain,
    Calendar,
    BarChart3,
    TrendingUp,
    Eye,
    Heart,
    Save,
    Play,
    ChevronLeft,
    ChevronRight,
    Target,
    Layers,
    Activity,
    FileText,
    ChevronDown,
    ChevronUp,
} from "lucide-react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import TestModelModal from "../components/TestModelModal";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";

const ModelDetail = () => {
    const DJANGO_BASE_URL = "http://localhost:8000";
    const { id } = useParams();
    const { user, token, updateLike } = useAuth();

    console.log(user);

    const [modelData, setModelData] = useState({});
    const [loading, setLoading] = useState(true);
    const [showAllFeatures, setShowAllFeatures] = useState(false);

    const [currentGraphIndex, setCurrentGraphIndex] = useState(0);
    const [isLiked, setIsLiked] = useState(user.liked_models.includes(id));
    const [likeCount, setLikeCount] = useState(
        modelData && modelData?.model?.likes
    );
    const [imageError, setImageError] = useState(false);

    const isClassification =
        modelData?.metrics?.accuracy !== undefined &&
        modelData?.metrics?.accuracy !== null;
    const isRegression =
        modelData?.metrics?.r2_score !== undefined &&
        modelData?.metrics?.r2_score !== null;

    const currentGraph = modelData?.graphs?.[currentGraphIndex] || null;

    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchModel = async () => {
            try {
                const response = await axios.get(
                    `http://127.0.0.1:8000/api/v1/trained-model/detail/${id}`,
                    {
                        withCredentials: true,
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (response.status === 200) {
                    setModelData(response.data);
                    setLikeCount(response.data.model.likes);
                    setLoading(false);
                    console.log(response.data);
                }
            } catch (error) {
                console.log(`Error fetching model detail: ${error.message}`);
                setLoading(false);
            }
        };

        fetchModel();
    }, [id]);

    useEffect(() => {
        console.log("model data ", modelData);
        console.log("user data ", user);
        console.log(modelData?.model?.user_id);
        console.log();
    }, [modelData]);

    const handleTestModel = () => {
        setIsModalOpen(true);
    };

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

    const handleLike = async () => {
        try {
            await updateLike(modelData.model.id).unwrap();
            setIsLiked((prev) => !prev);
            setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
        } catch (error) {
            console.log(`Error In Updating Likes: ${error.message}`);
        }
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

    const handlePublicState = async () => {
        try {
            const response = await axios.put(
                `http://127.0.0.1:8000/api/v1/trained-model/detail/${modelData.model.id}/`,
                {},
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status == 200) {
                toast.success("Model Public State Updated!");
                setModelData(response.data);
            }
        } catch (error) {
            console.log(
                `Error changing public state of model : ${error.message}`
            );
        }
    };

    const handleDownloadReport = async () => {
        try {
            const response = await axios.get(
                `http://127.0.0.1:8000/api/v1/trained-model/report/${id}`,
                {
                    responseType: "blob",
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;

            const timestamp = new Date()
                .toISOString()
                .replace(/[:.]/g, "-")
                .slice(0, 19);
            const filename = `${
                modelData.model?.name || "Model"
            }_Report_${timestamp}.pdf`;
            link.setAttribute("download", filename);

            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            toast.success("PDF report downloaded successfully!");
        } catch (error) {
            console.error("Error downloading report:", error);
            toast.error("Failed to download report. Please try again.");
        }
    };

    const renderClassificationStats = () => (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 md:p-6 border border-slate-700">
                <div className="flex items-center justify-between mb-2">
                    <Target className="w-5 h-5 md:w-6 md:h-6 text-yellow-500" />
                    <span className="text-xl md:text-2xl font-bold text-white">
                        {modelData.metrics &&
                            formatPercentage(modelData.metrics.accuracy)}
                    </span>
                </div>
                <p className="text-gray-300 text-sm md:text-base font-medium">
                    Accuracy
                </p>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 md:p-6 border border-slate-700">
                <div className="flex items-center justify-between mb-2">
                    <Activity className="w-5 h-5 md:w-6 md:h-6 text-orange-500" />
                    <span className="text-xl md:text-2xl font-bold text-white">
                        {modelData.metrics &&
                            formatPercentage(modelData.metrics.precision)}
                    </span>
                </div>
                <p className="text-gray-300 text-sm md:text-base font-medium">
                    Precision
                </p>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 md:p-6 border border-slate-700">
                <div className="flex items-center justify-between mb-2">
                    <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-yellow-500" />
                    <span className="text-xl md:text-2xl font-bold text-white">
                        {modelData.metrics &&
                            formatPercentage(modelData.metrics.recall)}
                    </span>
                </div>
                <p className="text-gray-300 text-sm md:text-base font-medium">
                    Recall
                </p>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 md:p-6 border border-slate-700">
                <div className="flex items-center justify-between mb-2">
                    <BarChart3 className="w-5 h-5 md:w-6 md:h-6 text-orange-500" />
                    <span className="text-xl md:text-2xl font-bold text-white">
                        {modelData.metrics &&
                            formatPercentage(modelData.metrics.f1_score)}
                    </span>
                </div>
                <p className="text-gray-300 text-sm md:text-base font-medium">
                    F1 Score
                </p>
            </div>
        </div>
    );

    const renderRegressionStats = () => (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 md:p-6 border border-slate-700">
                <div className="flex items-center justify-between mb-2">
                    <Target className="w-5 h-5 md:w-6 md:h-6 text-yellow-500" />
                    <span className="text-xl md:text-2xl font-bold text-white">
                        {modelData.metrics &&
                            formatNumber(modelData.metrics.r2_score)}
                    </span>
                </div>
                <p className="text-gray-300 text-sm md:text-base font-medium">
                    R² Score
                </p>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 md:p-6 border border-slate-700">
                <div className="flex items-center justify-between mb-2">
                    <Activity className="w-5 h-5 md:w-6 md:h-6 text-orange-500" />
                    <span className="text-xl md:text-2xl font-bold text-white">
                        {modelData.metrics &&
                            formatNumber(modelData.metrics.mse)}
                    </span>
                </div>
                <p className="text-gray-300 text-sm md:text-base font-medium">
                    MSE
                </p>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 md:p-6 border border-slate-700">
                <div className="flex items-center justify-between mb-2">
                    <BarChart3 className="w-5 h-5 md:w-6 md:h-6 text-yellow-500" />
                    <span className="text-xl md:text-2xl font-bold text-white">
                        {modelData.metrics &&
                            formatNumber(modelData.metrics.mae)}
                    </span>
                </div>
                <p className="text-gray-300 text-sm md:text-base font-medium">
                    MAE
                </p>
            </div>
        </div>
    );

    const renderFeaturesWithToggle = () => {
        const features = modelData?.model?.features
            ? modelData.model.features.split(",")
            : [];
        const maxVisibleFeatures = 6;
        const shouldShowToggle = features.length > maxVisibleFeatures;
        const visibleFeatures = showAllFeatures
            ? features
            : features.slice(0, maxVisibleFeatures);

        return (
            <div>
                <h3 className="text-gray-300 text-sm md:text-base font-semibold mb-3">
                    Features Used ({features.length})
                </h3>
                <div className="flex flex-wrap gap-2 mb-3">
                    {visibleFeatures.map((feature, index) => (
                        <span
                            key={index}
                            className="px-3 py-1.5 bg-gradient-to-r from-gray-800 to-slate-800 text-gray-200 rounded-lg text-sm md:text-base border border-slate-700 hover:border-slate-600 transition-colors duration-200"
                        >
                            {feature.trim()}
                        </span>
                    ))}
                </div>
                {shouldShowToggle && (
                    <button
                        onClick={() => setShowAllFeatures(!showAllFeatures)}
                        className="flex items-center gap-1 text-orange-400 hover:text-orange-300 text-sm md:text-base font-medium transition-colors duration-200"
                    >
                        {showAllFeatures ? (
                            <>
                                <ChevronUp className="w-4 h-4" />
                                Show Less
                            </>
                        ) : (
                            <>
                                <ChevronDown className="w-4 h-4" />
                                Show {features.length - maxVisibleFeatures} More
                            </>
                        )}
                    </button>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-rich-black-300 via-rich-black-400 to-raisin-black-300">
            <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-gradient-to-br from-dark-orange-500/20 to-goldenrod-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 md:w-80 md:h-80 bg-gradient-to-tr from-goldenrod-500/15 to-dark-orange-500/15 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-gradient-to-br from-dark-orange-500/5 to-goldenrod-500/5 rounded-full blur-3xl"></div>

            {loading ? (
                <div className="text-white text-center mt-10 px-4">
                    <div className="inline-flex items-center gap-3">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                        <span className="text-lg md:text-xl">
                            Loading model details...
                        </span>
                    </div>
                </div>
            ) : (
                <>
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
                        <div className="mb-6 md:mb-8">
                            <Link
                                to="/home"
                                className="flex items-center text-gray-300 hover:text-gray-200 mb-4 md:mb-6 transition-colors duration-200 text-sm md:text-base font-medium"
                            >
                                <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                                Back to Models
                            </Link>

                            <div className="flex flex-col space-y-4 md:space-y-6">
                                <div className="flex items-start gap-3 md:gap-4">
                                    <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Brain className="w-5 h-5 md:w-6 md:h-6 text-gray-900" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight break-words">
                                            {modelData.model &&
                                                modelData.model.name}
                                        </h1>
                                        <div className="flex flex-wrap items-center gap-2 md:gap-4 text-gray-300 text-sm md:text-base mt-2 font-medium">
                                            <span className="flex items-center gap-1">
                                                <Layers className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                                                <span className="truncate">
                                                    {modelData.model &&
                                                        modelData.model.type}
                                                </span>
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                                                <span className="truncate">
                                                    {modelData.model &&
                                                        formatDate(
                                                            modelData.model
                                                                .created_at
                                                        )}
                                                </span>
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Eye className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                                                <span>
                                                    {modelData.model &&
                                                    modelData.model.is_public
                                                        ? "Public"
                                                        : "Private"}
                                                </span>
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="px-2 md:px-3 py-1 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 text-yellow-400 rounded-full text-sm md:text-base font-semibold border border-yellow-500/30">
                                        {isClassification
                                            ? "Classification"
                                            : "Regression"}
                                    </span>
                                    <span className="px-2 md:px-3 py-1 bg-gradient-to-r from-slate-800 to-slate-900 text-gray-300 rounded-full text-sm md:text-base font-medium border border-slate-700">
                                        Target:{" "}
                                        {modelData.model &&
                                            modelData.model.target_column}
                                    </span>
                                </div>

                                <div className="flex flex-wrap gap-2 md:gap-3">
                                    {modelData &&
                                        modelData?.model?.user_id ==
                                            user["id"] && (
                                            <button
                                                onClick={handlePublicState}
                                                className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl transition-all duration-200 bg-gradient-to-r from-slate-800 to-slate-900 text-gray-300 hover:text-gray-200 border border-slate-700 text-sm md:text-base flex-shrink-0 font-medium"
                                            >
                                                <span className="hidden sm:inline">
                                                    Make
                                                </span>
                                                {modelData.model &&
                                                !modelData.model.is_public
                                                    ? "Public"
                                                    : "Private"}
                                            </button>
                                        )}

                                    <button
                                        onClick={handleLike}
                                        className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl transition-all duration-200 text-sm md:text-base flex-shrink-0 font-medium ${
                                            isLiked
                                                ? "bg-gradient-to-r from-orange-500 to-yellow-500 text-gray-900"
                                                : "bg-gradient-to-r from-slate-800 to-slate-900 text-gray-300 hover:text-gray-200 border border-slate-700"
                                        }`}
                                    >
                                        <Heart
                                            className={`w-4 h-4 md:w-5 md:h-5 ${
                                                isLiked ? "fill-current" : ""
                                            }`}
                                        />
                                        <span>{likeCount}</span>
                                    </button>

                                    <a
                                        href={
                                            modelData.model &&
                                            modelData.model.model_file
                                        }
                                        download
                                        className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl bg-gradient-to-r from-slate-800 to-slate-900 text-gray-300 hover:text-gray-200 border border-slate-700 text-sm md:text-base flex-shrink-0 font-medium"
                                    >
                                        <Save className="w-4 h-4 md:w-5 md:h-5" />
                                        <span className="hidden sm:inline">
                                            Download
                                        </span>
                                    </a>

                                    <button
                                        onClick={handleDownloadReport}
                                        className="flex items-center gap-2 px-3 md:px-4 py-2 bg-gradient-to-r from-slate-800 to-slate-900 text-gray-300 hover:text-gray-200 border border-slate-700 rounded-xl transition-all duration-200 hover:border-slate-600 text-sm md:text-base flex-shrink-0 font-medium"
                                    >
                                        <FileText className="w-4 h-4 md:w-5 md:h-5" />
                                        <span className="hidden sm:inline">
                                            PDF
                                        </span>
                                        <span className="sm:hidden">
                                            Report
                                        </span>
                                    </button>

                                    <button
                                        onClick={handleTestModel}
                                        className="flex items-center gap-2 px-3 md:px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-gray-900 rounded-xl hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-200 text-sm md:text-base flex-shrink-0 font-semibold"
                                    >
                                        <Play className="w-4 h-4 md:w-5 md:h-5" />
                                        <span>Test</span>
                                        <span className="hidden sm:inline">
                                            Model
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="grid lg:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8">
                            <div className="lg:col-span-1">
                                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-4 md:p-6 border border-slate-700 h-full">
                                    <h2 className="text-lg md:text-xl font-bold text-white mb-4 md:mb-6">
                                        Model Information
                                    </h2>

                                    <div className="space-y-4 md:space-y-6">
                                        {modelData?.model?.features &&
                                            renderFeaturesWithToggle()}

                                        {modelData.polynomial_degree && (
                                            <div>
                                                <h3 className="text-gray-300 text-sm md:text-base font-semibold mb-2">
                                                    Polynomial Degree
                                                </h3>
                                                <span className="px-3 py-1.5 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 rounded-lg text-sm md:text-base border border-yellow-500/30 font-medium">
                                                    {
                                                        modelData.model
                                                            .polynomial_degree
                                                    }
                                                </span>
                                            </div>
                                        )}

                                        <div>
                                            <h3 className="text-gray-300 text-sm md:text-base font-semibold mb-2">
                                                Model ID
                                            </h3>
                                            <div className="text-gray-200 text-xs md:text-sm font-mono bg-gradient-to-r from-gray-800 to-slate-800 p-3 rounded-lg border border-slate-700 break-all">
                                                {modelData.model &&
                                                    modelData.model.id}
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-gray-300 text-sm md:text-base font-semibold mb-2">
                                                Training Details
                                            </h3>
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm md:text-base">
                                                    <span className="text-gray-300 font-medium">
                                                        Algorithm:
                                                    </span>
                                                    <span className="text-gray-200 font-medium">
                                                        {modelData.model
                                                            ?.model_type ||
                                                            "N/A"}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between text-sm md:text-base">
                                                    <span className="text-gray-300 font-medium">
                                                        Task Type:
                                                    </span>
                                                    <span className="text-gray-200 font-medium">
                                                        {isClassification
                                                            ? "Classification"
                                                            : "Regression"}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between text-sm md:text-base">
                                                    <span className="text-gray-300 font-medium">
                                                        Status:
                                                    </span>
                                                    <span className="text-green-400 font-semibold">
                                                        Trained
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-2">
                                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-4 md:p-6 border border-slate-700">
                                    <h2 className="text-lg md:text-xl font-bold text-white mb-4 md:mb-6">
                                        Performance Metrics
                                    </h2>
                                    {isClassification
                                        ? renderClassificationStats()
                                        : renderRegressionStats()}
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-4 md:p-6 border border-slate-700">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 md:mb-6">
                                <h2 className="text-lg md:text-xl font-bold text-white">
                                    Model Visualizations
                                </h2>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={prevGraph}
                                        className="p-2 bg-gradient-to-r from-slate-700 to-slate-800 text-gray-300 hover:text-gray-200 rounded-lg transition-colors duration-200 border border-slate-600"
                                    >
                                        <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
                                    </button>
                                    <span className="text-gray-300 text-sm md:text-base px-2 font-medium">
                                        {currentGraphIndex + 1} /{" "}
                                        {modelData.graphs &&
                                            modelData.graphs.length}
                                    </span>
                                    <button
                                        onClick={nextGraph}
                                        className="p-2 bg-gradient-to-r from-slate-700 to-slate-800 text-gray-300 hover:text-gray-200 rounded-lg transition-colors duration-200 border border-slate-600"
                                    >
                                        <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
                                <div className="order-2 lg:order-1">
                                    <div className="bg-gradient-to-br from-gray-800 to-slate-800 rounded-xl p-4 border border-slate-700 aspect-square">
                                        {!imageError ? (
                                            <img
                                                src={`${DJANGO_BASE_URL}${currentGraph?.graph_image}`}
                                                alt={currentGraph?.title}
                                                className="w-full h-full object-contain rounded-lg transition-transform duration-200"
                                                onError={handleImageError}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <div className="text-center">
                                                    <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                                        <BarChart3 className="w-6 h-6 md:w-8 md:h-8 text-gray-900" />
                                                    </div>
                                                    <p className="text-gray-300 text-sm md:text-base font-medium">
                                                        Graph image not
                                                        available
                                                    </p>
                                                    <p className="text-gray-400 text-xs md:text-sm mt-1">
                                                        {currentGraph?.title}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="order-1 lg:order-2 space-y-4 md:space-y-6">
                                    <div>
                                        <h3 className="text-lg md:text-xl font-bold text-white mb-2">
                                            {currentGraph?.title}
                                        </h3>
                                        <p className="text-gray-300 mb-4 text-sm md:text-base">
                                            {currentGraph?.description}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                                        {modelData.graphs &&
                                            modelData.graphs.map(
                                                (graph, index) => (
                                                    <button
                                                        key={graph.id}
                                                        onClick={() => {
                                                            setCurrentGraphIndex(
                                                                index
                                                            );
                                                            setImageError(
                                                                false
                                                            );
                                                        }}
                                                        className={`relative p-2 md:p-3 rounded-lg transition-all duration-200 ${
                                                            currentGraphIndex ===
                                                            index
                                                                ? "bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border-2 border-orange-500/50"
                                                                : "bg-gradient-to-r from-gray-800 to-slate-800 border border-slate-700 hover:border-slate-600"
                                                        }`}
                                                    >
                                                        <div className="aspect-square bg-gradient-to-br from-slate-700 to-slate-800 rounded flex items-center justify-center overflow-hidden">
                                                            <img
                                                                src={`${DJANGO_BASE_URL}${graph.graph_image}`}
                                                                alt={
                                                                    graph.title
                                                                }
                                                                className="w-full h-full object-cover"
                                                                onError={(
                                                                    e
                                                                ) => {
                                                                    e.target.style.display =
                                                                        "none";
                                                                    e.target.nextSibling.style.display =
                                                                        "flex";
                                                                }}
                                                            />
                                                            <div className="w-full h-full items-center justify-center hidden">
                                                                <BarChart3 className="w-4 h-4 md:w-6 md:h-6 text-gray-400" />
                                                            </div>
                                                        </div>
                                                        <p className="text-xs md:text-sm text-gray-300 mt-2 truncate text-center font-medium">
                                                            {graph.title}
                                                        </p>
                                                    </button>
                                                )
                                            )}
                                    </div>

                                    <div className="bg-gradient-to-r from-slate-700/50 to-slate-800/50 rounded-lg p-4 border border-slate-600">
                                        <h4 className="text-sm md:text-base font-semibold text-white mb-3">
                                            Visualization Insights
                                        </h4>
                                        <div className="space-y-2 text-sm md:text-base">
                                            <div className="flex justify-between">
                                                <span className="text-gray-300 font-medium">
                                                    Total Graphs:
                                                </span>
                                                <span className="text-gray-200 font-medium">
                                                    {modelData.graphs?.length ||
                                                        0}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-300 font-medium">
                                                    Current:
                                                </span>
                                                <span className="text-gray-200 font-medium">
                                                    {currentGraph?.title ||
                                                        "N/A"}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-300 font-medium">
                                                    Type:
                                                </span>
                                                <span className="text-gray-200 font-medium">
                                                    {isClassification
                                                        ? "Classification Analysis"
                                                        : "Regression Analysis"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="block lg:hidden mt-6 pt-6 border-t border-slate-700">
                                <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2">
                                    {modelData.graphs &&
                                        modelData.graphs.map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => {
                                                    setCurrentGraphIndex(index);
                                                    setImageError(false);
                                                }}
                                                className={`w-3 h-3 rounded-full transition-all duration-200 flex-shrink-0 ${
                                                    currentGraphIndex === index
                                                        ? "bg-orange-500"
                                                        : "bg-slate-600 hover:bg-slate-500"
                                                }`}
                                            />
                                        ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 md:mt-8 grid md:grid-cols-2 gap-6">
                            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-4 md:p-6 border border-slate-700">
                                <h3 className="text-lg font-bold text-white mb-4">
                                    Performance Summary
                                </h3>
                                <div className="space-y-3">
                                    {isClassification ? (
                                        <>
                                            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-slate-700/50 to-slate-800/50 rounded-lg">
                                                <span className="text-gray-300 text-sm md:text-base font-medium">
                                                    Overall Accuracy
                                                </span>
                                                <span className="text-white font-semibold text-base md:text-lg">
                                                    {modelData.metrics &&
                                                        formatPercentage(
                                                            modelData.metrics
                                                                .accuracy
                                                        )}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-slate-700/50 to-slate-800/50 rounded-lg">
                                                <span className="text-gray-300 text-sm md:text-base font-medium">
                                                    Best Metric
                                                </span>
                                                <span className="text-green-400 font-semibold text-base md:text-lg">
                                                    {modelData.metrics &&
                                                        (modelData.metrics
                                                            .f1_score > 0.8
                                                            ? "Excellent F1"
                                                            : modelData.metrics
                                                                  .precision >
                                                              0.8
                                                            ? "High Precision"
                                                            : "Good Performance")}
                                                </span>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-slate-700/50 to-slate-800/50 rounded-lg">
                                                <span className="text-gray-300 text-sm md:text-base font-medium">
                                                    R² Score
                                                </span>
                                                <span className="text-white font-semibold text-base md:text-lg">
                                                    {modelData.metrics &&
                                                        formatNumber(
                                                            modelData.metrics
                                                                .r2_score
                                                        )}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-slate-700/50 to-slate-800/50 rounded-lg">
                                                <span className="text-gray-300 text-sm md:text-base font-medium">
                                                    Model Quality
                                                </span>
                                                <span className="text-green-400 font-semibold text-base md:text-lg">
                                                    {modelData.metrics &&
                                                        (modelData.metrics
                                                            .r2_score > 0.8
                                                            ? "Excellent"
                                                            : modelData.metrics
                                                                  .r2_score >
                                                              0.6
                                                            ? "Good"
                                                            : "Fair")}
                                                </span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-4 md:p-6 border border-slate-700">
                                <h3 className="text-lg font-bold text-white mb-4">
                                    Usage Statistics
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-slate-700/50 to-slate-800/50 rounded-lg">
                                        <span className="text-gray-300 text-sm md:text-base font-medium">
                                            Total Likes
                                        </span>
                                        <span className="text-white font-semibold text-base md:text-lg">
                                            {likeCount}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-slate-700/50 to-slate-800/50 rounded-lg">
                                        <span className="text-gray-300 text-sm md:text-base font-medium">
                                            Visibility
                                        </span>
                                        <span
                                            className={`font-semibold text-base md:text-lg ${
                                                modelData.model?.is_public
                                                    ? "text-green-400"
                                                    : "text-yellow-400"
                                            }`}
                                        >
                                            {modelData.model?.is_public
                                                ? "Public"
                                                : "Private"}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-slate-700/50 to-slate-800/50 rounded-lg">
                                        <span className="text-gray-300 text-sm md:text-base font-medium">
                                            Created
                                        </span>
                                        <span className="text-white font-semibold text-base md:text-lg">
                                            {modelData.model &&
                                                new Date(
                                                    modelData.model.created_at
                                                ).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <TestModelModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        modelData={modelData}
                    />
                </>
            )}
        </div>
    );
};

export default ModelDetail;
