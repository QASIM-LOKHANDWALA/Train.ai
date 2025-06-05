import React, { useState } from "react";
import {
    LuSearch,
    LuFilter,
    LuSparkles,
    LuChevronDown,
    LuGrid3X3,
    LuList,
} from "react-icons/lu";
import ModelCard from "../components/ModelCard";

const Home = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedFilter, setSelectedFilter] = useState("all");
    const [viewMode, setViewMode] = useState("grid");
    const [showFilters, setShowFilters] = useState(false);

    const mockModels = [
        {
            id: "c728ef22-db96-48bf-a040-012b2da9b0a4",
            user_id: "683862b9f9f761eb136250cd",
            model_name: "House Price Predictor",
            model_type: "PolynomialRegression",
            target_column: "price",
            features: "size,year,location,bedrooms",
            model_file:
                "/media/models/c728ef22-db96-48bf-a040-012b2da9b0a4_model.pkl",
            created_at: "2025-05-30T12:42:58.923142Z",
            is_public: true,
            likes: 12,
        },
        {
            id: "d839gf33-ec07-59cg-b151-123c3eb0c1b5",
            user_id: "794973c0g0g872fc247361de",
            model_name: "Stock Market Analyzer",
            model_type: "LinearRegression",
            target_column: "stock_price",
            features: "volume,open,high,low",
            model_file:
                "/media/models/d839gf33-ec07-59cg-b151-123c3eb0c1b5_model.pkl",
            created_at: "2025-05-29T09:15:23.445678Z",
            is_public: true,
            likes: 8,
        },
        {
            id: "e940hg44-fd18-60dh-c262-234d4fc1d2c6",
            user_id: "805084d1h1h983gd358472ef",
            model_name: "Sales Forecaster",
            model_type: "PolynomialRegression",
            target_column: "sales",
            features: "season,marketing_spend,competition",
            model_file:
                "/media/models/e940hg44-fd18-60dh-c262-234d4fc1d2c6_model.pkl",
            created_at: "2025-05-28T16:30:45.789012Z",
            is_public: true,
            likes: 15,
        },
    ];

    const modelTypes = [
        "all",
        "PolynomialRegression",
        "LinearRegression",
        "KNN",
        "DecisionTree",
    ];

    const filteredModels = mockModels.filter((model) => {
        const matchesSearch =
            model.model_name
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            model.model_type
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            model.target_column
                .toLowerCase()
                .includes(searchQuery.toLowerCase());
        const matchesFilter =
            selectedFilter === "all" || model.model_type === selectedFilter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-rich-black-300 via-rich-black-400 to-raisin-black-300">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-dark-orange-500/20 to-goldenrod-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-goldenrod-500/15 to-dark-orange-500/15 rounded-full blur-3xl"></div>

            <div className="relative max-w-7xl mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center bg-gradient-to-r from-raisin-black-500 to-raisin-black-alt-500 rounded-full px-6 py-3 mb-8 border border-raisin-black-600">
                        <LuSparkles className="w-4 h-4 text-goldenrod-500 mr-2" />
                        <span className="text-anti-flash-white-300 text-sm font-medium">
                            Community Models • Public Repository
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold text-anti-flash-white-500 mb-6">
                        Discover{" "}
                        <span className="bg-gradient-to-r from-dark-orange-500 to-goldenrod-500 bg-clip-text text-transparent">
                            AI Models
                        </span>
                    </h1>

                    <p className="text-xl text-anti-flash-white-400 mb-8 max-w-3xl mx-auto">
                        Explore thousands of machine learning models created by
                        our community. Find the perfect model for your project
                        or get inspired by others' work.
                    </p>
                </div>

                <div className="mb-8">
                    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                        <div className="relative flex-1 max-w-2xl">
                            <LuSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-anti-flash-white-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search models, types, or targets..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-gradient-to-r from-raisin-black-500 to-raisin-black-alt-500 border border-raisin-black-600 rounded-xl text-anti-flash-white-500 placeholder-anti-flash-white-400 focus:outline-none focus:ring-2 focus:ring-dark-orange-500 focus:border-transparent transition-all duration-200"
                            />
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="flex items-center px-4 py-3 bg-gradient-to-r from-raisin-black-500 to-raisin-black-alt-500 border border-raisin-black-600 rounded-xl text-anti-flash-white-500 hover:border-raisin-black-500 transition-colors"
                                >
                                    <LuFilter className="w-4 h-4 mr-2" />
                                    Filter
                                    <LuChevronDown
                                        className={`w-4 h-4 ml-2 transition-transform ${
                                            showFilters ? "rotate-180" : ""
                                        }`}
                                    />
                                </button>

                                {showFilters && (
                                    <div className="absolute top-full mt-2 right-0 bg-raisin-black-500 border border-raisin-black-600 rounded-xl p-4 min-w-48 z-10">
                                        <div className="space-y-2">
                                            <p className="text-sm font-medium text-anti-flash-white-400 mb-3">
                                                Model Type
                                            </p>
                                            {modelTypes.map((type) => (
                                                <button
                                                    key={type}
                                                    onClick={() => {
                                                        setSelectedFilter(type);
                                                        setShowFilters(false);
                                                    }}
                                                    className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                                                        selectedFilter === type
                                                            ? "bg-gradient-to-r from-dark-orange-500 to-goldenrod-500 text-rich-black-400"
                                                            : "text-anti-flash-white-300 hover:bg-raisin-black-400"
                                                    }`}
                                                >
                                                    {type === "all"
                                                        ? "All Types"
                                                        : type
                                                              .replace(
                                                                  /([A-Z])/g,
                                                                  " $1"
                                                              )
                                                              .trim()}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center border border-raisin-black-600 rounded-lg overflow-hidden">
                                <button
                                    onClick={() => setViewMode("grid")}
                                    className={`p-2 transition-colors ${
                                        viewMode === "grid"
                                            ? "bg-gradient-to-r from-dark-orange-500 to-goldenrod-500 text-rich-black-400"
                                            : "bg-raisin-black-500 text-anti-flash-white-400 hover:text-anti-flash-white-300"
                                    }`}
                                >
                                    <LuGrid3X3 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode("list")}
                                    className={`p-2 transition-colors ${
                                        viewMode === "list"
                                            ? "bg-gradient-to-r from-dark-orange-500 to-goldenrod-500 text-rich-black-400"
                                            : "bg-raisin-black-500 text-anti-flash-white-400 hover:text-anti-flash-white-300"
                                    }`}
                                >
                                    <LuList className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4">
                        <p className="text-anti-flash-white-400">
                            Found {filteredModels.length} model
                            {filteredModels.length !== 1 ? "s" : ""}
                            {selectedFilter !== "all" && (
                                <span className="ml-2 px-2 py-1 bg-dark-orange-500/20 text-goldenrod-400 text-sm rounded-md">
                                    {selectedFilter
                                        .replace(/([A-Z])/g, " $1")
                                        .trim()}
                                </span>
                            )}
                        </p>
                    </div>
                </div>

                <div
                    className={`grid gap-6 ${
                        viewMode === "grid"
                            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                            : "grid-cols-1 max-w-4xl mx-auto"
                    }`}
                >
                    {filteredModels.map((model) => (
                        <ModelCard key={model.id} model={model} />
                    ))}
                </div>

                {filteredModels.length === 0 && (
                    <div className="text-center py-16">
                        <div className="w-24 h-24 bg-gradient-to-r from-dark-orange-500 to-goldenrod-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <LuSearch className="w-12 h-12 text-rich-black-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-anti-flash-white-500 mb-4">
                            No models found
                        </h3>
                        <p className="text-anti-flash-white-400 mb-6">
                            Try adjusting your search terms or filters to find
                            what you're looking for.
                        </p>
                        <button
                            onClick={() => {
                                setSearchQuery("");
                                setSelectedFilter("all");
                            }}
                            className="px-6 py-3 bg-gradient-to-r from-dark-orange-500 to-goldenrod-500 text-rich-black-400 font-medium rounded-xl hover:shadow-lg hover:shadow-dark-orange-500/30 transition-all duration-200"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
export default Home;
