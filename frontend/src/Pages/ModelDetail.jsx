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

    const [currentGraphIndex, setCurrentGraphIndex] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700">
                <div className="flex items-center justify-between mb-2">
                    <Target className="w-6 h-6 text-yellow-500" />
                    <span className="text-2xl font-bold text-white">
                        {modelData.metrics &&
                            formatPercentage(modelData.metrics.accuracy)}
                    </span>
                </div>
                <p className="text-gray-400 text-sm">Accuracy</p>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700">
                <div className="flex items-center justify-between mb-2">
                    <Activity className="w-6 h-6 text-orange-500" />
                    <span className="text-2xl font-bold text-white">
                        {modelData.metrics &&
                            formatPercentage(modelData.metrics.precision)}
                    </span>
                </div>
                <p className="text-gray-400 text-sm">Precision</p>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700">
                <div className="flex items-center justify-between mb-2">
                    <TrendingUp className="w-6 h-6 text-yellow-500" />
                    <span className="text-2xl font-bold text-white">
                        {modelData.metrics &&
                            formatPercentage(modelData.metrics.recall)}
                    </span>
                </div>
                <p className="text-gray-400 text-sm">Recall</p>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700">
                <div className="flex items-center justify-between mb-2">
                    <BarChart3 className="w-6 h-6 text-orange-500" />
                    <span className="text-2xl font-bold text-white">
                        {modelData.metrics &&
                            formatPercentage(modelData.metrics.f1_score)}
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
                        {modelData.metrics &&
                            formatNumber(modelData.metrics.r2_score)}
                    </span>
                </div>
                <p className="text-gray-400 text-sm">R² Score</p>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700">
                <div className="flex items-center justify-between mb-2">
                    <Activity className="w-6 h-6 text-orange-500" />
                    <span className="text-2xl font-bold text-white">
                        {modelData.metrics &&
                            formatNumber(modelData.metrics.mse)}
                    </span>
                </div>
                <p className="text-gray-400 text-sm">MSE</p>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700">
                <div className="flex items-center justify-between mb-2">
                    <BarChart3 className="w-6 h-6 text-yellow-500" />
                    <span className="text-2xl font-bold text-white">
                        {modelData.metrics &&
                            formatNumber(modelData.metrics.mae)}
                    </span>
                </div>
                <p className="text-gray-400 text-sm">MAE</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-rich-black-300 via-rich-black-400 to-raisin-black-300">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-dark-orange-500/20 to-goldenrod-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-goldenrod-500/15 to-dark-orange-500/15 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-dark-orange-500/5 to-goldenrod-500/5 rounded-full blur-3xl"></div>
            {loading ? (
                <div className="text-white text-center mt-10">
                    Loading model details...
                </div>
            ) : (
                <>
                    <div className="relative max-w-7xl mx-auto px-4 py-8">
                        <div className="mb-8">
                            <Link
                                to="/home"
                                className="flex items-center text-gray-400 hover:text-gray-300 mb-6 transition-colors duration-200"
                            >
                                <ChevronLeft className="w-5 h-5 mr-2" />
                                Back to Models
                            </Link>

                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                                <div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center">
                                            <Brain className="w-6 h-6 text-gray-900" />
                                        </div>
                                        <div>
                                            <h1 className="text-3xl md:text-4xl font-bold text-white">
                                                {modelData.model &&
                                                    modelData.model.name}
                                            </h1>
                                            <div className="flex items-center gap-4 text-gray-400 text-sm">
                                                <span className="flex items-center gap-1">
                                                    <Layers className="w-4 h-4" />
                                                    {modelData.model &&
                                                        modelData.model
                                                            .model_type}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    {modelData.model &&
                                                        formatDate(
                                                            modelData.model
                                                                .created_at
                                                        )}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Eye className="w-4 h-4" />
                                                    {modelData.model &&
                                                    modelData.model.is_public
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
                                            Target:{" "}
                                            {modelData.model &&
                                                modelData.model.target_column}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    {modelData &&
                                        modelData.model.user_id ==
                                            user["_id"] && (
                                            <button
                                                onClick={handlePublicState}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 bg-gradient-to-r from-slate-800 to-slate-900 text-gray-400 hover:text-gray-300 border border-slate-700`}
                                            >
                                                Make{" "}
                                                {modelData.model &&
                                                !modelData.model.is_public
                                                    ? "Public"
                                                    : "Private"}
                                            </button>
                                        )}

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

                                    <a
                                        href={
                                            modelData.model &&
                                            modelData.model.model_file
                                        }
                                        download
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-slate-800 to-slate-900 text-gray-400 hover:text-gray-300 border border-slate-700"
                                    >
                                        <Save className="w-5 h-5" />
                                        Download
                                    </a>

                                    <button
                                        onClick={handleDownloadReport}
                                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-slate-800 to-slate-900 text-gray-400 hover:text-gray-300 border border-slate-700 rounded-xl transition-all duration-200 hover:border-slate-600"
                                    >
                                        <FileText className="w-5 h-5" />
                                        PDF Report
                                    </button>

                                    <button
                                        onClick={handleTestModel}
                                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-gray-900 rounded-xl hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-200"
                                    >
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
                                                {modelData?.model?.features &&
                                                    modelData.model.features
                                                        .split(",")
                                                        .map(
                                                            (
                                                                feature,
                                                                index
                                                            ) => (
                                                                <span
                                                                    key={index}
                                                                    className="px-3 py-1 bg-gradient-to-r from-gray-800 to-slate-800 text-gray-300 rounded-lg text-sm border border-slate-700"
                                                                >
                                                                    {feature.trim()}
                                                                </span>
                                                            )
                                                        )}
                                            </div>
                                        </div>

                                        {modelData.polynomial_degree && (
                                            <div>
                                                <h3 className="text-gray-400 text-sm font-medium mb-2">
                                                    Polynomial Degree
                                                </h3>
                                                <span className="px-3 py-1 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-500 rounded-lg text-sm border border-yellow-500/30">
                                                    {
                                                        modelData.model
                                                            .polynomial_degree
                                                    }
                                                </span>
                                            </div>
                                        )}

                                        <div>
                                            <h3 className="text-gray-400 text-sm font-medium mb-2">
                                                Model ID
                                            </h3>
                                            <p className="text-gray-300 text-sm font-mono bg-gradient-to-r from-gray-800 to-slate-800 p-3 rounded-lg border border-slate-700 break-all">
                                                {modelData.model &&
                                                    modelData.model.id}
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
                                        {modelData.graphs &&
                                            modelData.graphs.length}
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
                                                        Graph image not
                                                        available
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
                                                        className={`relative p-3 rounded-lg transition-all duration-200 ${
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
                                                                <BarChart3 className="w-6 h-6 text-gray-400" />
                                                            </div>
                                                        </div>
                                                        <p className="text-xs text-gray-400 mt-2 truncate">
                                                            {graph.title}
                                                        </p>
                                                    </button>
                                                )
                                            )}
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
