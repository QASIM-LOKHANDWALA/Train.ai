import React, { useState, useEffect } from "react";
import { X, Play, AlertCircle, CheckCircle, Loader } from "lucide-react";
import useApi from "../hooks/useApi";

const TestModelModal = ({ isOpen, onClose, modelData }) => {
    const [features, setFeatures] = useState({});
    const [prediction, setPrediction] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const { predictModel, loading, error, clearError } = useApi();

    const modelFeatures = React.useMemo(() => {
        const features = modelData?.model?.features
            ? modelData.model.features.split(",").map((f) => f.trim())
            : [];
        console.log("Model features:", features);
        return features;
    }, [modelData?.model?.features]);

    useEffect(() => {
        console.log("useEffect triggered:", {
            isOpen,
            modelFeaturesLength: modelFeatures.length,
            isInitialized,
        });

        if (isOpen && modelFeatures.length > 0 && !isInitialized) {
            const initialFeatures = {};
            modelFeatures.forEach((feature) => {
                initialFeatures[feature] = "";
            });
            console.log("Initializing features:", initialFeatures);
            setFeatures(initialFeatures);
            setPrediction(null);
            setShowResult(false);
            setIsInitialized(true);
            if (clearError) clearError();
        }

        if (!isOpen) {
            setIsInitialized(false);
        }
    }, [isOpen, modelFeatures, isInitialized, clearError]);

    const handleFeatureChange = (featureName, value) => {
        console.log("handleFeatureChange called:", { featureName, value });
        console.log("Current features before update:", features);

        setFeatures((prevFeatures) => {
            const newFeatures = { ...prevFeatures, [featureName]: value };
            console.log("New features after update:", newFeatures);
            return newFeatures;
        });
    };

    const validateFeatures = () => {
        for (const [key, value] of Object.entries(features)) {
            if (value === "" || value === null || value === undefined) {
                return `Please provide a value for ${key}`;
            }
            if (isNaN(Number(value))) {
                return `${key} must be a valid number`;
            }
        }
        return null;
    };

    const handlePredict = async () => {
        const validationError = validateFeatures();
        if (validationError) {
            alert(validationError);
            return;
        }

        try {
            const featureValues = modelFeatures.map((feature) =>
                Number(features[feature])
            );

            const result = await predictModel(
                modelData.model.id,
                featureValues
            );
            setPrediction(result.prediction);
            setShowResult(true);
        } catch (err) {
            console.error("Prediction error:", err);
        }
    };

    const handleClose = () => {
        setShowResult(false);
        setPrediction(null);
        clearError();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center">
                            <Play className="w-5 h-5 text-gray-900" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">
                                Test Model
                            </h2>
                            <p className="text-gray-400 text-sm">
                                {modelData?.model?.name}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-slate-700 rounded-lg transition-colors duration-200"
                    >
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                    {!showResult ? (
                        <div>
                            <p className="text-gray-300 mb-6">
                                Enter values for all features to get a
                                prediction from your model.
                            </p>

                            <div className="space-y-4 mb-6">
                                {modelFeatures.length === 0 ? (
                                    <div className="text-red-400">
                                        No model features found. Check modelData
                                        structure.
                                    </div>
                                ) : (
                                    modelFeatures.map((feature) => (
                                        <div key={feature}>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                {feature}
                                            </label>
                                            <input
                                                type="number"
                                                step="any"
                                                value={features[feature] || ""}
                                                onChange={(e) => {
                                                    console.log(
                                                        "Input onChange:",
                                                        {
                                                            feature,
                                                            value: e.target
                                                                .value,
                                                        }
                                                    );
                                                    handleFeatureChange(
                                                        feature,
                                                        e.target.value
                                                    );
                                                }}
                                                className="w-full px-4 py-3 bg-gradient-to-r from-gray-800 to-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-200"
                                                placeholder={`Enter ${feature} value`}
                                                autoComplete="off"
                                                readOnly={false}
                                            />
                                        </div>
                                    ))
                                )}
                            </div>

                            {error && (
                                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-red-400 font-medium">
                                            Prediction Failed
                                        </p>
                                        <p className="text-red-300 text-sm mt-1">
                                            {error}
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-3">
                                <button
                                    onClick={handleClose}
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-gray-700 to-slate-700 text-gray-300 rounded-lg hover:from-gray-600 hover:to-slate-600 transition-all duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handlePredict}
                                    disabled={loading}
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-gray-900 rounded-lg hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <>
                                            <Loader className="w-4 h-4 animate-spin" />
                                            Predicting...
                                        </>
                                    ) : (
                                        <>
                                            <Play className="w-4 h-4" />
                                            Get Prediction
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="w-8 h-8 text-white" />
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-2">
                                Prediction Complete!
                            </h3>
                            <p className="text-gray-400 mb-6">
                                Your model has generated the following
                                prediction:
                            </p>

                            <div className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-xl p-6 mb-6 border border-slate-600">
                                <p className="text-gray-300 text-sm mb-2">
                                    Predicted Value
                                </p>
                                <p className="text-3xl font-bold text-white">
                                    {Array.isArray(prediction)
                                        ? prediction[0]
                                        : prediction}
                                </p>
                                {Array.isArray(prediction) &&
                                    prediction.length > 1 && (
                                        <div className="mt-4">
                                            <p className="text-gray-400 text-sm mb-2">
                                                All Predictions:
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {prediction.map(
                                                    (pred, index) => (
                                                        <span
                                                            key={index}
                                                            className="px-3 py-1 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 text-orange-300 rounded-lg text-sm border border-orange-500/30"
                                                        >
                                                            {pred}
                                                        </span>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}
                            </div>

                            <div className="bg-gradient-to-r from-gray-800 to-slate-800 rounded-xl p-4 mb-6 border border-slate-700">
                                <p className="text-gray-300 text-sm mb-3">
                                    Input Features Used:
                                </p>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    {modelFeatures.map((feature) => (
                                        <div
                                            key={feature}
                                            className="flex justify-between"
                                        >
                                            <span className="text-gray-400">
                                                {feature}:
                                            </span>
                                            <span className="text-white font-medium">
                                                {features[feature]}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowResult(false)}
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-gray-700 to-slate-700 text-gray-300 rounded-lg hover:from-gray-600 hover:to-slate-600 transition-all duration-200"
                                >
                                    Test Again
                                </button>
                                <button
                                    onClick={handleClose}
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-gray-900 rounded-lg hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-200"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TestModelModal;
