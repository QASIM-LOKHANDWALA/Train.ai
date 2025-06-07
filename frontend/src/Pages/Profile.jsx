import React, { useEffect, useState } from "react";
import {
    LuUser,
    LuMail,
    LuCalendar,
    LuCrown,
    LuHeart,
    LuBrain,
    LuSave,
    LuX,
    LuDatabase,
} from "react-icons/lu";
import { MdOutlineModeEdit } from "react-icons/md";
import ModelCard from "../components/ModelCard";
import { useAuth } from "../hooks/useAuth";
import { useProfile } from "../hooks/useProfile";

const Profile = () => {
    const [activeTab, setActiveTab] = useState("trained");
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [userDetails, setUserDetails] = useState(user);

    const [trainedModels, setTrainedModels] = useState([]);
    const { getTrainedModels } = useProfile();

    useEffect(() => {
        const fetchModels = async () => {
            const data = await getTrainedModels();
            if (data) {
                setTrainedModels(data);
            }
        };
        fetchModels();
    }, []);

    // const trainedModels = [
    //     {
    //         id: "c728ef22-db96-48bf-a040-012b2da9b0a4",
    //         user_id: "683862b9f9f761eb136250cd",
    //         model_name: "House Price Predictor",
    //         model_type: "PolynomialRegression",
    //         target_column: "price",
    //         features: "size,year,location,bedrooms",
    //         model_file:
    //             "/media/models/c728ef22-db96-48bf-a040-012b2da9b0a4_model.pkl",
    //         created_at: "2025-05-30T12:42:58.923142Z",
    //         is_public: true,
    //         likes: 12,
    //     },
    //     {
    //         id: "b827df33-cb85-37af-b151-123c3eb0c1b5",
    //         user_id: "683862b9f9f761eb136250cd",
    //         model_name: "Sales Forecaster",
    //         model_type: "LinearRegression",
    //         target_column: "sales",
    //         features: "month,marketing_spend,seasonality",
    //         model_file:
    //             "/media/models/b827df33-cb85-37af-b151-123c3eb0c1b5_model.pkl",
    //         created_at: "2025-05-28T09:15:23.456789Z",
    //         is_public: false,
    //         likes: 8,
    //     },
    //     {
    //         id: "d938fe44-dc96-48bf-c262-234d4fa0d2c6",
    //         user_id: "683862b9f9f761eb136250cd",
    //         model_name: "Customer Classifier",
    //         model_type: "DecisionTree",
    //         target_column: "customer_type",
    //         features: "age,income,purchase_history,location",
    //         model_file:
    //             "/media/models/d938fe44-dc96-48bf-c262-234d4fa0d2c6_model.pkl",
    //         created_at: "2025-05-25T14:20:15.789012Z",
    //         is_public: true,
    //         likes: 15,
    //     },
    // ];

    const likedModels = [
        {
            id: "a123bc45-ef67-89gh-ijkl-mnop12345678",
            user_id: "other_user_id",
            model_name: "Stock Market Predictor",
            model_type: "KNN",
            target_column: "stock_price",
            features: "volume,ma_50,ma_200,rsi",
            model_file:
                "/media/models/a123bc45-ef67-89gh-ijkl-mnop12345678_model.pkl",
            created_at: "2025-05-20T16:45:30.123456Z",
            is_public: true,
            likes: 24,
        },
        {
            id: "e456fg78-hi90-jklm-nopq-rst123456789",
            user_id: "another_user_id",
            model_name: "Weather Forecast Model",
            model_type: "PolynomialRegression",
            target_column: "temperature",
            features: "humidity,pressure,wind_speed,season",
            model_file:
                "/media/models/e456fg78-hi90-jklm-nopq-rst123456789_model.pkl",
            created_at: "2025-05-18T11:30:45.987654Z",
            is_public: true,
            likes: 18,
        },
    ];

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    };

    const handleSave = () => {
        setIsEditing(false);
        console.log("Saving user details:", userDetails);
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    const tabs = [
        {
            id: "trained",
            label: "My Models",
            icon: LuBrain,
            count: trainedModels.length,
        },
        {
            id: "liked",
            label: "Liked Models",
            icon: LuHeart,
            count: likedModels.length,
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-rich-black-300 via-rich-black-400 to-raisin-black-300">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-dark-orange-500/10 to-goldenrod-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-goldenrod-500/5 to-dark-orange-500/5 rounded-full blur-3xl"></div>

            <div className="relative max-w-7xl mx-auto px-4 py-8">
                <div className="bg-gradient-to-br from-raisin-black-400 to-raisin-black-alt-400 rounded-3xl p-8 mb-8 border border-raisin-black-600 shadow-xl">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
                        <div className="flex items-center space-x-6 mb-6 lg:mb-0">
                            <div className="w-24 h-24 bg-gradient-to-r from-dark-orange-500 to-goldenrod-500 rounded-full flex items-center justify-center">
                                <LuUser className="w-12 h-12 text-rich-black-400" />
                            </div>

                            <div className="space-y-2">
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={userDetails.full_name}
                                        onChange={(e) =>
                                            setUserDetails({
                                                ...userDetails,
                                                full_name: e.target.value,
                                            })
                                        }
                                        className="text-2xl font-bold bg-raisin-black-500 text-anti-flash-white-500 px-3 py-1 rounded-lg border border-raisin-black-600"
                                    />
                                ) : (
                                    <h1 className="text-2xl lg:text-3xl font-bold text-anti-flash-white-500">
                                        {userDetails.full_name}
                                    </h1>
                                )}

                                <div className="flex items-center text-anti-flash-white-400">
                                    <LuMail className="w-4 h-4 mr-2" />
                                    <span>{userDetails.email}</span>
                                </div>

                                <div className="flex items-center text-anti-flash-white-400">
                                    <LuCalendar className="w-4 h-4 mr-2" />
                                    <span>
                                        Joined{" "}
                                        {formatDate(userDetails.created_at)}
                                    </span>
                                </div>

                                {userDetails.premium_user && (
                                    <div className="flex items-center">
                                        <div className="inline-flex items-center bg-gradient-to-r from-goldenrod-500 to-dark-orange-500 text-rich-black-400 px-3 py-1 rounded-full text-sm font-bold">
                                            <LuCrown className="w-4 h-4 mr-1" />
                                            Premium User
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center space-x-4">
                            {isEditing ? (
                                <>
                                    <button
                                        onClick={handleSave}
                                        className="flex items-center px-4 py-2 bg-gradient-to-r from-dark-orange-500 to-goldenrod-500 text-rich-black-400 rounded-full font-bold hover:shadow-lg hover:shadow-dark-orange-500/30 transition-all duration-200"
                                    >
                                        <LuSave className="w-4 h-4 mr-2" />
                                        Save
                                    </button>
                                    <button
                                        onClick={handleCancel}
                                        className="flex items-center px-4 py-2 bg-raisin-black-600 text-anti-flash-white-400 rounded-full hover:bg-raisin-black-500 transition-colors duration-200"
                                    >
                                        <LuX className="w-4 h-4 mr-2" />
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center px-4 py-2 bg-gradient-to-r from-raisin-black-500 to-raisin-black-alt-500 text-anti-flash-white-400 rounded-full border border-raisin-black-600 hover:border-raisin-black-500 transition-all duration-200"
                                >
                                    <MdOutlineModeEdit className="w-4 h-4 mr-2" />
                                    Edit Profile
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-8 pt-8 border-t border-raisin-black-600">
                        <div className="text-center group">
                            <div className="text-2xl font-bold text-anti-flash-white-500 group-hover:text-goldenrod-500 transition-colors duration-200">
                                {trainedModels.length}
                            </div>
                            <div className="text-anti-flash-white-400 text-sm">
                                Models Trained
                            </div>
                        </div>
                        <div className="text-center group">
                            <div className="text-2xl font-bold text-anti-flash-white-500 group-hover:text-goldenrod-500 transition-colors duration-200">
                                {likedModels.length}
                            </div>
                            <div className="text-anti-flash-white-400 text-sm">
                                Models Liked
                            </div>
                        </div>
                        <div className="text-center group">
                            <div className="text-2xl font-bold text-anti-flash-white-500 group-hover:text-goldenrod-500 transition-colors duration-200">
                                {userDetails.premium_user
                                    ? "♾️"
                                    : userDetails.limit}
                            </div>
                            <div className="text-anti-flash-white-400 text-sm">
                                Limit
                            </div>
                        </div>
                        <div className="text-center group">
                            <div className="text-2xl font-bold text-anti-flash-white-500 group-hover:text-goldenrod-500 transition-colors duration-200">
                                {trainedModels.reduce(
                                    (sum, model) => sum + model.likes,
                                    0
                                )}
                            </div>
                            <div className="text-anti-flash-white-400 text-sm">
                                Total Likes
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs Navigation */}
                <div className="flex space-x-1 mb-8 bg-gradient-to-r from-raisin-black-500 to-raisin-black-alt-500 p-2 rounded-2xl border border-raisin-black-600">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                                activeTab === tab.id
                                    ? "bg-gradient-to-r from-dark-orange-500 to-goldenrod-500 text-rich-black-400 shadow-lg"
                                    : "text-anti-flash-white-400 hover:text-anti-flash-white-300 hover:bg-raisin-black-600"
                            }`}
                        >
                            <tab.icon className="w-5 h-5" />
                            <span>{tab.label}</span>
                            <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                    activeTab === tab.id
                                        ? "bg-rich-black-500 text-goldenrod-200"
                                        : "bg-raisin-black-600 text-anti-flash-white-400"
                                }`}
                            >
                                {tab.count}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="relative">
                    {activeTab === "trained" && (
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-anti-flash-white-500">
                                    My Trained Models
                                </h2>
                                <div className="flex items-center text-anti-flash-white-400">
                                    <LuDatabase className="w-4 h-4 mr-2" />
                                    <span>{trainedModels.length} models</span>
                                </div>
                            </div>

                            {trainedModels.length > 0 ? (
                                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {trainedModels.map((model) => (
                                        <ModelCard
                                            key={model.id}
                                            model={model}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-gradient-to-br from-raisin-black-500 to-raisin-black-alt-500 rounded-2xl border border-raisin-black-600">
                                    <LuBrain className="w-16 h-16 text-raisin-black-600 mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-anti-flash-white-500 mb-2">
                                        No models trained yet
                                    </h3>
                                    <p className="text-anti-flash-white-400 mb-6">
                                        Start building your first AI model
                                        today!
                                    </p>
                                    <button className="px-6 py-3 bg-gradient-to-r from-dark-orange-500 to-goldenrod-500 text-rich-black-400 rounded-full font-bold hover:shadow-lg hover:shadow-dark-orange-500/30 transition-all duration-200">
                                        Train Your First Model
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "liked" && (
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-anti-flash-white-500">
                                    Liked Models
                                </h2>
                                <div className="flex items-center text-anti-flash-white-400">
                                    <LuHeart className="w-4 h-4 mr-2" />
                                    <span>{likedModels.length} models</span>
                                </div>
                            </div>

                            {likedModels.length > 0 ? (
                                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {likedModels.map((model) => (
                                        <ModelCard
                                            key={model.id}
                                            model={model}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-gradient-to-br from-raisin-black-500 to-raisin-black-alt-500 rounded-2xl border border-raisin-black-600">
                                    <LuHeart className="w-16 h-16 text-raisin-black-600 mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-anti-flash-white-500 mb-2">
                                        No liked models yet
                                    </h3>
                                    <p className="text-anti-flash-white-400 mb-6">
                                        Explore the community and like models
                                        you find interesting!
                                    </p>
                                    <button className="px-6 py-3 bg-gradient-to-r from-dark-orange-500 to-goldenrod-500 text-rich-black-400 rounded-full font-bold hover:shadow-lg hover:shadow-dark-orange-500/30 transition-all duration-200">
                                        Explore Models
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
