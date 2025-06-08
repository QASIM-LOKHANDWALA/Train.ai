import React, { useState } from "react";
import {
    LuBrain,
    LuUpload,
    LuPlay,
    LuSettings,
    LuTrendingUp,
    LuGitBranch,
    LuTarget,
    LuFileText,
    LuChevronDown,
    LuCheck,
    LuCircleAlert,
    LuX,
} from "react-icons/lu";
import Papa from "papaparse";
import { useTrain } from "../hooks/useTrain";

const TrainModel = () => {
    const [selectedModel, setSelectedModel] = useState("");
    const [route, setRoute] = useState("");
    const [modelName, setModelName] = useState("");
    const [csvFile, setCsvFile] = useState(null);
    const [targetColumn, setTargetColumn] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isTraining, setIsTraining] = useState(false);
    const [csvColumns, setCsvColumns] = useState([]);

    const { trainModel } = useTrain();

    const modelTypes = [
        {
            id: "linear",
            name: "Linear Regression",
            icon: <LuTrendingUp className="w-5 h-5" />,
            description:
                "Best for continuous numerical predictions with linear relationships",
            color: "from-blue-500 to-blue-600",
            api: "regression/linear",
        },
        {
            id: "polynomial",
            name: "Polynomial Regression",
            icon: <LuGitBranch className="w-5 h-5" />,
            description:
                "Handles non-linear relationships and curved data patterns",
            color: "from-purple-500 to-purple-600",
            api: "regression/polynomial",
        },
        {
            id: "decision_tree",
            name: "Decision Tree",
            icon: <LuBrain className="w-5 h-5" />,
            description:
                "Great for both classification and regression with interpretable rules",
            color: "from-green-500 to-green-600",
            api: "decision-tree",
        },
        {
            id: "knn",
            name: "K-Nearest Neighbors",
            icon: <LuTarget className="w-5 h-5" />,
            description:
                "Simple yet effective for classification and regression tasks",
            color: "from-orange-500 to-red-500",
            api: "k-neighbors",
        },
    ];

    const handleFileUpload = (event) => {
        const file = event.target.files[0];

        if (file && file.type === "text/csv") {
            setCsvFile(file);

            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    const columns = Object.keys(results.data[0]);
                    console.log("CSV Column Names:", columns);
                    setCsvColumns(columns);
                    console.log("First Row Example:", results.data[0]);
                },
                error: (err) => {
                    console.error("Error parsing CSV:", err.message);
                },
            });
        }
    };

    const handleTrainModel = async () => {
        if (!selectedModel || !modelName || !csvFile || !targetColumn) {
            return;
        }

        setIsTraining(true);
        console.log(modelName, selectedModel, targetColumn, route);

        const data = await trainModel(modelName, targetColumn, csvFile, route);
        console.log(data);
        setIsTraining(false);
    };

    const isFormValid =
        selectedModel && modelName.trim() && csvFile && targetColumn;

    return (
        <div className="min-h-screen bg-gradient-to-br from-rich-black-300 via-rich-black-400 to-raisin-black-300">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-500/10 to-yellow-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-yellow-500/5 to-orange-500/5 rounded-full blur-3xl"></div>

            <div className="relative max-w-6xl mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center bg-gradient-to-r from-gray-800 to-gray-700 rounded-full px-6 py-3 mb-6 border border-gray-600">
                        <LuBrain className="w-4 h-4 text-orange-500 mr-2" />
                        <span className="text-gray-300 text-sm font-medium">
                            No Code ML Training • Easy Setup
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                        Train Your{" "}
                        <span className="bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
                            ML Model
                        </span>
                    </h1>

                    <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                        Select your algorithm, upload your data, and let our
                        platform handle the rest. No coding experience required.
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 shadow-xl">
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                                <LuSettings className="w-6 h-6 mr-3 text-orange-500" />
                                Choose Your Algorithm
                            </h2>

                            <div className="grid md:grid-cols-2 gap-4 mb-8">
                                {modelTypes.map((model) => (
                                    <div
                                        key={model.id}
                                        className={`p-6 rounded-xl cursor-pointer transition-all duration-300 border-2 ${
                                            selectedModel === model.id
                                                ? "border-orange-500/50 bg-gradient-to-br from-gray-700 to-gray-800 shadow-lg"
                                                : "border-gray-600 bg-gradient-to-br from-gray-800 to-gray-900 hover:border-gray-500"
                                        }`}
                                        onClick={() => {
                                            setSelectedModel(model.id);
                                            setRoute(model.api);
                                        }}
                                    >
                                        <div className="flex items-start space-x-4">
                                            <div
                                                className={`p-3 rounded-lg bg-gradient-to-r ${model.color} text-white`}
                                            >
                                                {model.icon}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center mb-2">
                                                    <h3 className="text-lg font-bold text-white">
                                                        {model.name}
                                                    </h3>
                                                    {selectedModel ===
                                                        model.id && (
                                                        <LuCheck className="w-5 h-5 text-orange-500 ml-2" />
                                                    )}
                                                </div>
                                                <p className="text-gray-400 text-sm">
                                                    {model.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="text-white font-semibold mb-3 flex items-center">
                                        <LuFileText className="w-4 h-4 mr-2 text-orange-500" />
                                        Model Name
                                    </label>
                                    <input
                                        type="text"
                                        value={modelName}
                                        onChange={(e) =>
                                            setModelName(e.target.value)
                                        }
                                        placeholder="Enter a name for your model"
                                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="text-white font-semibold mb-3 flex items-center">
                                        <LuUpload className="w-4 h-4 mr-2 text-orange-500" />
                                        Upload CSV File
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            accept=".csv"
                                            onChange={handleFileUpload}
                                            className="hidden"
                                            id="csv-upload"
                                        />
                                        <label
                                            htmlFor="csv-upload"
                                            className="flex items-center justify-center w-full p-6 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-orange-500 transition-colors"
                                        >
                                            <div className="text-center">
                                                {csvFile ? (
                                                    <div className="flex items-center text-green-400">
                                                        <LuCheck className="w-5 h-5 mr-2" />
                                                        <span>
                                                            {csvFile.name}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <LuUpload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                                        <p className="text-gray-400">
                                                            Click to upload your
                                                            CSV file
                                                        </p>
                                                        <p className="text-gray-500 text-sm mt-1">
                                                            Supports .csv files
                                                            only
                                                        </p>
                                                    </>
                                                )}
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-white font-semibold mb-3 flex items-center">
                                        <LuTarget className="w-4 h-4 mr-2 text-orange-500" />
                                        Target Column
                                    </label>
                                    <div className="relative">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setIsDropdownOpen(
                                                    !isDropdownOpen
                                                )
                                            }
                                            disabled={!csvFile}
                                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-left focus:border-orange-500 focus:outline-none transition-colors flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <span
                                                className={
                                                    targetColumn
                                                        ? "text-white"
                                                        : "text-gray-400"
                                                }
                                            >
                                                {targetColumn ||
                                                    "Select target column"}
                                            </span>
                                            <LuChevronDown
                                                className={`w-4 h-4 transition-transform ${
                                                    isDropdownOpen
                                                        ? "rotate-180"
                                                        : ""
                                                }`}
                                            />
                                        </button>

                                        {isDropdownOpen &&
                                            csvColumns.length > 0 && (
                                                <div className="absolute z-10 w-full mt-1 bg-gray-700 border border-gray-600 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                                    {csvColumns.map(
                                                        (column) => (
                                                            <button
                                                                key={column}
                                                                type="button"
                                                                onClick={() => {
                                                                    setTargetColumn(
                                                                        column
                                                                    );
                                                                    setIsDropdownOpen(
                                                                        false
                                                                    );
                                                                }}
                                                                className="w-full px-4 py-2 text-left text-white hover:bg-gray-600 transition-colors"
                                                            >
                                                                {column}
                                                            </button>
                                                        )
                                                    )}
                                                </div>
                                            )}
                                    </div>
                                    {!csvFile && (
                                        <p className="text-gray-500 text-sm mt-1">
                                            Upload a CSV file first to see
                                            available columns
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700">
                            <h3 className="text-xl font-bold text-white mb-4">
                                Training Summary
                            </h3>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400">
                                        Algorithm:
                                    </span>
                                    <span className="text-white font-medium">
                                        {selectedModel
                                            ? modelTypes.find(
                                                  (m) => m.id === selectedModel
                                              )?.name
                                            : "Not selected"}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400">
                                        Model Name:
                                    </span>
                                    <span className="text-white font-medium">
                                        {modelName || "Not provided"}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400">
                                        Dataset:
                                    </span>
                                    <div className="flex items-center">
                                        {csvFile ? (
                                            <LuCheck className="w-4 h-4 text-green-400 mr-1" />
                                        ) : (
                                            <LuX className="w-4 h-4 text-red-400 mr-1" />
                                        )}
                                        <span className="text-white font-medium">
                                            {csvFile ? "Uploaded" : "Missing"}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400">
                                        Target:
                                    </span>
                                    <span className="text-white font-medium">
                                        {targetColumn || "Not selected"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {!isFormValid && (
                            <div className="bg-yellow-900/20 border border-yellow-600/50 rounded-lg p-4">
                                <div className="flex items-start">
                                    <LuCircleAlert className="w-5 h-5 text-yellow-500 mr-2 mt-0.5" />
                                    <div>
                                        <h4 className="text-yellow-500 font-semibold mb-1">
                                            Complete Required Fields
                                        </h4>
                                        <ul className="text-yellow-400 text-sm space-y-1">
                                            {!selectedModel && (
                                                <li>• Select an algorithm</li>
                                            )}
                                            {!modelName.trim() && (
                                                <li>• Provide a model name</li>
                                            )}
                                            {!csvFile && (
                                                <li>• Upload a CSV file</li>
                                            )}
                                            {!targetColumn && (
                                                <li>
                                                    • Choose a target column
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}

                        <button
                            onClick={handleTrainModel}
                            disabled={!isFormValid || isTraining}
                            className="w-full group relative bg-gradient-to-r from-orange-500 to-yellow-500 text-black px-6 py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-orange-500/30 active:scale-95 transition-all duration-200 border-2 border-transparent hover:border-yellow-300/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            <div className="relative z-10 flex items-center justify-center">
                                {isTraining ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                                        Training Model...
                                    </>
                                ) : (
                                    <>
                                        <LuPlay className="w-5 h-5 mr-2" />
                                        Start Training
                                    </>
                                )}
                            </div>
                            {!isTraining && (
                                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                            )}
                        </button>

                        <div className="text-center text-gray-500 text-sm">
                            <p>Training typically takes 1-5 minutes</p>
                            <p>depending on your dataset size</p>
                        </div>
                    </div>
                </div>

                <div className="mt-12 grid md:grid-cols-3 gap-6">
                    <div className="text-center p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <LuUpload className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-white font-semibold mb-2">
                            Easy Upload
                        </h3>
                        <p className="text-gray-400 text-sm">
                            Simply drag and drop your CSV file or click to
                            browse
                        </p>
                    </div>

                    <div className="text-center p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <LuBrain className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-white font-semibold mb-2">
                            Auto-Optimization
                        </h3>
                        <p className="text-gray-400 text-sm">
                            Our platform automatically optimizes your model
                            parameters
                        </p>
                    </div>

                    <div className="text-center p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <LuTrendingUp className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-white font-semibold mb-2">
                            Real-time Progress
                        </h3>
                        <p className="text-gray-400 text-sm">
                            Track your model training progress in real-time
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrainModel;
