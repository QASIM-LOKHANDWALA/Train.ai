import React from "react";

const Pricing = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-rich-black-300 via-rich-black-400 to-raisin-black-300 py-10 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-2xl md:text-3xl font-bold text-anti-flash-white-500 mb-4">
                        Choose Your Plan
                    </h1>
                    <p className="text-anti-flash-white-400 text-sm max-w-2xl mx-auto">
                        Select the perfect plan for your needs. Upgrade or
                        downgrade at any time.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-6">
                    {/* Basic Plan */}
                    <div className="flex flex-col items-center justify-between w-80 h-[530px] p-8 bg-gradient-to-br from-rich-black-500 to-raisin-black-alt-500 rounded-2xl shadow-xl border border-raisin-black-600 relative overflow-hidden group hover:scale-[1.02] transition-all duration-300">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-dark-orange-500/15 to-goldenrod-500/15 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-goldenrod-500/10 to-dark-orange-500/10 rounded-full blur-2xl"></div>

                        <div className="flex flex-col items-center text-center">
                            <div className="mb-6 relative z-10">
                                <p className="text-goldenrod-500 text-lg font-semibold tracking-wide uppercase">
                                    Basic
                                </p>
                                <div className="h-0.5 w-12 bg-gradient-to-r from-goldenrod-500 to-dark-orange-500 mx-auto mt-2"></div>
                            </div>

                            <p className="text-anti-flash-white-400 text-base mb-6 leading-relaxed">
                                Perfect for getting started with essential
                                features
                            </p>

                            <ul className="text-anti-flash-white-300 text-sm space-y-1 mb-6">
                                <li className="flex items-center">
                                    <span className="w-2 h-2 bg-goldenrod-500 rounded-full mr-3"></span>
                                    100 Credits per month
                                </li>
                                <li className="flex items-center">
                                    <span className="w-2 h-2 bg-goldenrod-500 rounded-full mr-3"></span>
                                    Basic features
                                </li>
                                <li className="flex items-center">
                                    <span className="w-2 h-2 bg-goldenrod-500 rounded-full mr-3"></span>
                                    Email support
                                </li>
                            </ul>
                        </div>

                        <div className="flex flex-col items-center">
                            <div className="mb-6 relative z-10">
                                <h2 className="text-anti-flash-white-500 text-4xl font-bold">
                                    Free
                                </h2>
                                <div className="flex items-center justify-center mt-1">
                                    <span className="text-anti-flash-white-400 text-sm">
                                        forever
                                    </span>
                                </div>
                            </div>

                            <button className="relative bg-gradient-to-r from-raisin-black-600 to-raisin-black-700 text-anti-flash-white-500 px-8 py-3 rounded-full font-semibold text-sm hover:shadow-lg hover:from-raisin-black-500 hover:to-raisin-black-600 active:scale-95 transition-all duration-200 border border-raisin-black-500 w-full">
                                <span className="relative z-10">Try Now</span>
                            </button>
                        </div>

                        <div className="absolute inset-0 bg-gradient-to-t from-rich-black-500/30 to-transparent rounded-2xl"></div>
                    </div>

                    {/* Pro Plan - Featured */}
                    <div className="flex flex-col items-center justify-between w-80 h-[590px] p-8 bg-gradient-to-br from-rich-black-400 to-raisin-black-alt-400 rounded-2xl shadow-2xl border-2 border-gradient-to-r border-dark-orange-500 relative group hover:scale-[1.05] transition-all duration-300 lg:-mt-6">
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-dark-orange-500 to-goldenrod-500 text-rich-black-500 px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                            Most Popular
                        </div>

                        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-dark-orange-500/30 to-goldenrod-500/30 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-goldenrod-500/20 to-dark-orange-500/20 rounded-full blur-2xl"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-br from-dark-orange-500/10 to-goldenrod-500/10 rounded-full blur-3xl"></div>

                        <div className="flex flex-col items-center text-center">
                            <div className="mb-6 relative z-10 mt-4">
                                <p className="text-goldenrod-400 text-2xl font-bold tracking-wide uppercase">
                                    Pro
                                </p>
                                <div className="h-1 w-16 bg-gradient-to-r from-goldenrod-400 to-dark-orange-400 mx-auto mt-2"></div>
                            </div>

                            <p className="text-anti-flash-white-300 text-base mb-6 leading-relaxed">
                                Everything you need to scale your business
                            </p>

                            <ul className="text-anti-flash-white-200 text-sm space-y-3 mb-6">
                                <li className="flex items-center">
                                    <span className="w-2 h-2 bg-dark-orange-500 rounded-full mr-3"></span>
                                    Unlimited Credits
                                </li>
                                <li className="flex items-center">
                                    <span className="w-2 h-2 bg-dark-orange-500 rounded-full mr-3"></span>
                                    All Premium Features
                                </li>
                                <li className="flex items-center">
                                    <span className="w-2 h-2 bg-dark-orange-500 rounded-full mr-3"></span>
                                    Priority Support
                                </li>
                                <li className="flex items-center">
                                    <span className="w-2 h-2 bg-dark-orange-500 rounded-full mr-3"></span>
                                    Advanced Analytics
                                </li>
                            </ul>
                        </div>

                        <div className="flex flex-col items-center">
                            <div className="mb-6 relative z-10">
                                <div className="flex items-baseline justify-center">
                                    <span className="text-anti-flash-white-400 text-lg line-through mr-2">
                                        $19.99
                                    </span>
                                    <h2 className="text-anti-flash-white-200 text-5xl font-bold">
                                        $9.99
                                    </h2>
                                </div>
                                <div className="flex items-center justify-center mt-1">
                                    <span className="text-anti-flash-white-300 text-sm">
                                        per month
                                    </span>
                                </div>
                            </div>

                            <button className="relative bg-gradient-to-r from-dark-orange-500 to-goldenrod-500 text-rich-black-400 px-8 py-4 rounded-full font-bold text-base hover:shadow-xl hover:shadow-dark-orange-500/30 active:scale-95 transition-all duration-200 border-2 border-transparent hover:border-goldenrod-300/50 group w-full">
                                <span className="relative z-10">
                                    Subscribe Now
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-goldenrod-400 to-dark-orange-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                            </button>
                        </div>

                        <div className="absolute inset-0 bg-gradient-to-t from-rich-black-400/40 to-transparent rounded-2xl group-hover:from-rich-black-300/50 transition-all duration-300"></div>
                    </div>

                    {/* Enterprise Plan */}
                    <div className="flex flex-col items-center justify-between w-80 h-[530px] p-8 bg-gradient-to-br from-rich-black-500 to-raisin-black-alt-500 rounded-2xl shadow-xl border border-raisin-black-600 relative overflow-hidden group hover:scale-[1.02] transition-all duration-300">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-dark-orange-500/15 to-goldenrod-500/15 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-goldenrod-500/10 to-dark-orange-500/10 rounded-full blur-2xl"></div>

                        <div className="flex flex-col items-center text-center">
                            <div className="mb-6 relative z-10">
                                <p className="text-goldenrod-500 text-lg font-semibold tracking-wide uppercase">
                                    Enterprise
                                </p>
                                <div className="h-0.5 w-12 bg-gradient-to-r from-goldenrod-500 to-dark-orange-500 mx-auto mt-2"></div>
                            </div>

                            <p className="text-anti-flash-white-400 text-base mb-6 leading-relaxed">
                                Custom solutions for large organizations
                            </p>

                            <ul className="text-anti-flash-white-300 text-sm space-y-1 mb-6">
                                <li className="flex items-center">
                                    <span className="w-2 h-2 bg-goldenrod-500 rounded-full mr-3"></span>
                                    Custom Credits
                                </li>
                                <li className="flex items-center">
                                    <span className="w-2 h-2 bg-goldenrod-500 rounded-full mr-3"></span>
                                    All Features + Custom
                                </li>
                                <li className="flex items-center">
                                    <span className="w-2 h-2 bg-goldenrod-500 rounded-full mr-3"></span>
                                    Dedicated Support
                                </li>
                                <li className="flex items-center">
                                    <span className="w-2 h-2 bg-goldenrod-500 rounded-full mr-3"></span>
                                    SLA Guarantee
                                </li>
                            </ul>
                        </div>

                        <div className="flex flex-col items-center">
                            <div className="mb-6 relative z-10">
                                <h2 className="text-anti-flash-white-500 text-3xl font-bold">
                                    Custom
                                </h2>
                                <div className="flex items-center justify-center mt-1">
                                    <span className="text-anti-flash-white-400 text-sm">
                                        pricing
                                    </span>
                                </div>
                            </div>

                            <button className="relative bg-gradient-to-r from-raisin-black-600 to-raisin-black-700 text-anti-flash-white-500 px-8 py-3 rounded-full font-semibold text-sm hover:shadow-lg hover:from-raisin-black-500 hover:to-raisin-black-600 active:scale-95 transition-all duration-200 border border-raisin-black-500 w-full">
                                <span className="relative z-10">
                                    Contact Sales
                                </span>
                            </button>
                        </div>

                        <div className="absolute inset-0 bg-gradient-to-t from-rich-black-500/30 to-transparent rounded-2xl"></div>
                    </div>
                </div>

                <div className="text-center mt-16">
                    <p className="text-anti-flash-white-400 text-sm mb-4">
                        All plans include a 14-day free trial. No credit card
                        required.
                    </p>
                    <div className="flex items-center justify-center space-x-6 text-anti-flash-white-300 text-sm">
                        <span className="flex items-center">
                            <svg
                                className="w-4 h-4 mr-2 text-goldenrod-500"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                ></path>
                            </svg>
                            Cancel anytime
                        </span>
                        <span className="flex items-center">
                            <svg
                                className="w-4 h-4 mr-2 text-goldenrod-500"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                ></path>
                            </svg>
                            24/7 Support
                        </span>
                        <span className="flex items-center">
                            <svg
                                className="w-4 h-4 mr-2 text-goldenrod-500"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                ></path>
                            </svg>
                            Secure & Safe
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Pricing;
