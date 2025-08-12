import React, { useState } from "react";
import {
    LuBrain,
    LuSearch,
    LuEye,
    LuZap,
    LuChevronRight,
    LuPlay,
    LuTrendingUp,
    LuShield,
    LuUsers,
    LuSparkles,
} from "react-icons/lu";
import { Link } from "react-router-dom";
import Pricing from "../components/Pricing";

const LandingPage = () => {
    const [activeFeature, setActiveFeature] = useState(0);

    const features = [
        {
            icon: <LuBrain className="w-8 h-8" />,
            title: "Train Models",
            description:
                "Create powerful ML models without any coding experience",
            details:
                "Our intuitive interface guides you through the entire training process, from data upload to model deployment.",
        },
        {
            icon: <LuEye className="w-8 h-8" />,
            title: "Visualize Results",
            description:
                "Interactive charts and graphs to understand your model's performance",
            details:
                "Real-time visualization tools help you interpret model behavior and make data-driven decisions.",
        },
        {
            icon: <LuSearch className="w-8 h-8" />,
            title: "Discover Models",
            description:
                "Browse and explore pre-trained models from our community",
            details:
                "Access a vast library of models created by experts and the community for various use cases.",
        },
        {
            icon: <LuZap className="w-8 h-8" />,
            title: "Make Predictions",
            description:
                "Deploy and use your trained models for real-world predictions",
            details:
                "Easy-to-use prediction interface with API access for seamless integration into your applications.",
        },
    ];

    const stats = [
        { value: "10K+", label: "Models Trained" },
        { value: "50K+", label: "Active Users" },
        { value: "99.9%", label: "Uptime" },
        { value: "24/7", label: "Support" },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-rich-black-300 via-rich-black-400 to-raisin-black-300">
            <div className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-dark-orange-500/20 to-goldenrod-500/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-goldenrod-500/15 to-dark-orange-500/15 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-dark-orange-500/5 to-goldenrod-500/5 rounded-full blur-3xl"></div>

                <div className="relative max-w-7xl mx-auto px-4 py-20 lg:py-32">
                    <div className="text-center">
                        <div className="inline-flex items-center bg-gradient-to-r from-raisin-black-500 to-raisin-black-alt-500 rounded-full px-6 py-3 mb-8 border border-raisin-black-600">
                            <LuSparkles className="w-4 h-4 text-goldenrod-500 mr-2" />
                            <span className="text-anti-flash-white-300 text-sm font-medium">
                                No Coding Required • Beginner Friendly
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-anti-flash-white-500 mb-6 leading-tight">
                            Train{" "}
                            <span className="bg-gradient-to-r from-dark-orange-500 to-goldenrod-500 bg-clip-text text-transparent">
                                AI Models
                            </span>
                            <br />
                            Without Code
                        </h1>

                        <p className="text-xl md:text-2xl text-anti-flash-white-400 mb-12 max-w-3xl mx-auto leading-relaxed">
                            Create, visualize, and deploy machine learning
                            models with our intuitive platform. No programming
                            experience needed.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <Link
                                to="/auth"
                                className="group relative bg-gradient-to-r from-dark-orange-500 to-goldenrod-500 text-rich-black-400 px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl hover:shadow-dark-orange-500/30 active:scale-95 transition-all duration-200 border-2 border-transparent hover:border-goldenrod-300/50"
                            >
                                <div className="relative z-10 flex items-center">
                                    Start Training Now
                                    <LuChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-r from-goldenrod-400 to-dark-orange-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                            </Link>

                            <button className="group flex items-center text-anti-flash-white-400 hover:text-anti-flash-white-300 transition-colors duration-200">
                                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-raisin-black-500 to-raisin-black-alt-500 rounded-full mr-4 group-hover:scale-110 transition-transform duration-200 border border-raisin-black-600">
                                    <LuPlay className="w-5 h-5 text-goldenrod-500 ml-1" />
                                </div>
                                <span className="font-semibold">
                                    Watch Demo
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative py-20 border-t border-raisin-black-600">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center group">
                                <div className="text-3xl md:text-4xl font-bold text-anti-flash-white-500 mb-2 group-hover:text-goldenrod-500 transition-colors duration-200">
                                    {stat.value}
                                </div>
                                <div className="text-anti-flash-white-400 text-sm font-medium">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="relative py-20">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-anti-flash-white-500 mb-6">
                            Everything You Need to
                            <br />
                            <span className="bg-gradient-to-r from-dark-orange-500 to-goldenrod-500 bg-clip-text text-transparent">
                                Build AI Solutions
                            </span>
                        </h2>
                        <p className="text-xl text-anti-flash-white-400 max-w-2xl mx-auto">
                            From training to deployment, our platform provides
                            all the tools you need to create powerful AI models.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 ${
                                        activeFeature === index
                                            ? "bg-gradient-to-r from-raisin-black-400 to-raisin-black-alt-400 border-2 border-dark-orange-500/50 shadow-lg"
                                            : "bg-gradient-to-r from-raisin-black-500 to-raisin-black-alt-500 border border-raisin-black-600 hover:border-raisin-black-500"
                                    }`}
                                    onClick={() => setActiveFeature(index)}
                                >
                                    <div className="flex items-start space-x-4">
                                        <div
                                            className={`p-3 rounded-lg ${
                                                activeFeature === index
                                                    ? "bg-gradient-to-r from-dark-orange-500 to-goldenrod-500 text-rich-black-400"
                                                    : "bg-raisin-black-600 text-goldenrod-500"
                                            }`}
                                        >
                                            {feature.icon}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-anti-flash-white-500 mb-2">
                                                {feature.title}
                                            </h3>
                                            <p className="text-anti-flash-white-400 mb-3">
                                                {feature.description}
                                            </p>
                                            <p
                                                className={`text-sm transition-all duration-300 ${
                                                    activeFeature === index
                                                        ? "text-anti-flash-white-300 opacity-100"
                                                        : "text-anti-flash-white-400 opacity-0 h-0"
                                                }`}
                                            >
                                                {activeFeature === index &&
                                                    feature.details}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="relative">
                            <div className="bg-gradient-to-br from-raisin-black-400 to-raisin-black-alt-400 rounded-2xl p-8 border border-raisin-black-600 shadow-xl">
                                <div className="aspect-square bg-gradient-to-br from-rich-black-500 to-raisin-black-500 rounded-xl p-6 border border-raisin-black-600">
                                    <div className="h-full flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="w-20 h-20 bg-gradient-to-r from-dark-orange-500 to-goldenrod-500 rounded-full flex items-center justify-center mb-4 mx-auto">
                                                {features[activeFeature].icon}
                                            </div>
                                            <h4 className="text-lg font-bold text-anti-flash-white-500 mb-2">
                                                {features[activeFeature].title}
                                            </h4>
                                            <p className="text-anti-flash-white-400 text-sm">
                                                Interactive preview
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-goldenrod-500/20 to-dark-orange-500/20 rounded-full blur-2xl"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative py-20 border-t border-raisin-black-600">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-anti-flash-white-500 mb-6">
                            Why Choose Our Platform?
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center p-8 bg-gradient-to-br from-raisin-black-500 to-raisin-black-alt-500 rounded-2xl border border-raisin-black-600 hover:border-raisin-black-500 transition-colors duration-300 group">
                            <div className="w-16 h-16 bg-gradient-to-r from-dark-orange-500 to-goldenrod-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                <LuTrendingUp className="w-8 h-8 text-rich-black-400" />
                            </div>
                            <h3 className="text-xl font-bold text-anti-flash-white-500 mb-4">
                                Fast & Accurate
                            </h3>
                            <p className="text-anti-flash-white-400">
                                State-of-the-art algorithms ensure your models
                                are both fast to train and highly accurate in
                                their predictions.
                            </p>
                        </div>

                        <div className="text-center p-8 bg-gradient-to-br from-raisin-black-500 to-raisin-black-alt-500 rounded-2xl border border-raisin-black-600 hover:border-raisin-black-500 transition-colors duration-300 group">
                            <div className="w-16 h-16 bg-gradient-to-r from-dark-orange-500 to-goldenrod-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                <LuShield className="w-8 h-8 text-rich-black-400" />
                            </div>
                            <h3 className="text-xl font-bold text-anti-flash-white-500 mb-4">
                                Secure & Private
                            </h3>
                            <p className="text-anti-flash-white-400">
                                Your data is encrypted and protected with
                                enterprise-grade security. We never share or
                                sell your information.
                            </p>
                        </div>

                        <div className="text-center p-8 bg-gradient-to-br from-raisin-black-500 to-raisin-black-alt-500 rounded-2xl border border-raisin-black-600 hover:border-raisin-black-500 transition-colors duration-300 group">
                            <div className="w-16 h-16 bg-gradient-to-r from-dark-orange-500 to-goldenrod-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                <LuUsers className="w-8 h-8 text-rich-black-400" />
                            </div>
                            <h3 className="text-xl font-bold text-anti-flash-white-500 mb-4">
                                Expert Support
                            </h3>
                            <p className="text-anti-flash-white-400">
                                Our team of ML experts is available 24/7 to help
                                you succeed with your AI projects and answer any
                                questions.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <Pricing />

            <div className="relative py-20 border-t border-raisin-black-600">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-to-br from-dark-orange-500/10 to-goldenrod-500/10 rounded-full blur-3xl"></div>

                <div className="relative max-w-4xl mx-auto text-center px-4">
                    <h2 className="text-3xl md:text-5xl font-bold text-anti-flash-white-500 mb-6">
                        Ready to Build Your First
                        <br />
                        <span className="bg-gradient-to-r from-dark-orange-500 to-goldenrod-500 bg-clip-text text-transparent">
                            AI Model?
                        </span>
                    </h2>

                    <p className="text-xl text-anti-flash-white-400 mb-10 max-w-2xl mx-auto">
                        Join thousands of users who are already building amazing
                        AI solutions without writing a single line of code.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <button className="group relative bg-gradient-to-r from-dark-orange-500 to-goldenrod-500 text-rich-black-400 px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl hover:shadow-dark-orange-500/30 active:scale-95 transition-all duration-200 border-2 border-transparent hover:border-goldenrod-300/50">
                            <Link
                                to={"/auth"}
                                className="relative z-10 flex items-center"
                            >
                                Get Started Free
                                <LuChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <div className="absolute inset-0 bg-gradient-to-r from-goldenrod-400 to-dark-orange-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                        </button>

                        <Link
                            to={"/pricing"}
                            className="text-anti-flash-white-400 hover:text-anti-flash-white-300 font-semibold transition-colors duration-200"
                        >
                            View Pricing Plans
                        </Link>
                    </div>

                    <div className="mt-8 text-anti-flash-white-400 text-sm">
                        ✓ Free 14-day trial • ✓ No credit card required • ✓
                        Cancel anytime
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
