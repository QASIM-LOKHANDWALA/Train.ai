import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import {
    LuMail,
    LuLock,
    LuUser,
    LuEye,
    LuEyeOff,
    LuSparkles,
    LuChevronRight,
} from "react-icons/lu";
import toast, { Toaster } from "react-hot-toast";
import { Home } from "lucide-react";

const Login = () => {
    const [login, setLogin] = useState(true);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const navigate = useNavigate();

    const {
        user,
        isLoading,
        error,
        isAuthenticated,
        signup,
        signin,
        signout,
        clearAuthError,
    } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Form submitted", { name, email, password, login });

        try {
            if (!login) {
                await signup({ email, password, full_name: name }).unwrap();
                toast.success("Account created successfully!");
                navigate("/home");
            } else {
                await signin({ email, password }).unwrap();
                toast.success("Logged in successfully!");
                navigate("/home");
            }
            if (error) {
                toast.error(error);
                clearAuthError();
            }
        } catch (err) {
            if (error) {
                toast.error(error);
                clearAuthError();
            }
            console.error("Authentication error:", err);
        }
    };

    return (
        <div className="h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-500/20 to-yellow-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-yellow-500/15 to-orange-500/15 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-orange-500/5 to-yellow-500/5 rounded-full blur-3xl"></div>

            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800/50 to-gray-900/50 z-10"></div>
                <img
                    className="h-full w-full object-cover"
                    src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1965&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="AI Technology Background"
                />
                <div className="absolute inset-0 z-20 flex items-center justify-center p-12">
                    <div className="text-center">
                        <h2 className="text-4xl font-bold text-white mb-4">
                            Welcome to the Future of
                            <span className="block bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
                                AI Development
                            </span>
                        </h2>
                        <p className="text-xl text-gray-300 max-w-md">
                            Build powerful AI models without writing a single
                            line of code
                        </p>
                    </div>
                </div>
            </div>

            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-30">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center bg-gradient-to-r from-gray-800 to-gray-700 rounded-full px-4 py-2 mb-6 border border-gray-600">
                            <LuSparkles className="w-4 h-4 text-yellow-500 mr-2" />
                            <span className="text-gray-300 text-sm font-medium">
                                Secure Authentication
                            </span>
                        </div>

                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                            {login ? "Welcome Back" : "Create Account"}
                        </h1>
                        <p className="text-gray-400">
                            {login
                                ? "Sign in to continue building amazing AI models"
                                : "Join thousands of users creating AI solutions"}
                        </p>
                    </div>

                    <div className="space-y-6">
                        {!login && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <LuUser className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                        className="w-full pl-12 pr-4 py-3 bg-gradient-to-r from-gray-800 to-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                                        placeholder="Enter your full name"
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <LuMail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-gradient-to-r from-gray-800 to-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <LuLock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    className="w-full pl-12 pr-12 py-3 bg-gradient-to-r from-gray-800 to-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                                    placeholder="Enter your password"
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                >
                                    {showPassword ? (
                                        <LuEyeOff className="h-5 w-5 text-gray-400 hover:text-yellow-500 transition-colors" />
                                    ) : (
                                        <LuEye className="h-5 w-5 text-gray-400 hover:text-yellow-500 transition-colors" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {login && (
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) =>
                                            setRememberMe(e.target.checked)
                                        }
                                        className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-orange-500 focus:ring-orange-500 focus:ring-offset-0"
                                    />
                                    <label
                                        htmlFor="remember-me"
                                        className="ml-2 text-sm text-gray-400"
                                    >
                                        Remember me
                                    </label>
                                </div>
                                <button
                                    type="button"
                                    className="text-sm text-yellow-500 hover:text-yellow-400 transition-colors"
                                >
                                    Forgot password?
                                </button>
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="group relative w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-gray-900 py-3 px-4 rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-orange-500/30 active:scale-95 transition-all duration-200 border-2 border-transparent hover:border-yellow-300/50"
                        >
                            <span className="relative z-10 flex items-center justify-center">
                                {login ? "Sign In" : "Create Account"}
                                <LuChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                        </button>

                        <div className="text-center">
                            <p className="text-gray-400">
                                {login
                                    ? "Don't have an account?"
                                    : "Already have an account?"}
                                <button
                                    type="button"
                                    onClick={() => setLogin(!login)}
                                    className="ml-2 text-yellow-500 hover:text-yellow-400 font-semibold transition-colors"
                                >
                                    {login ? "Sign up" : "Sign in"}
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
                <Link
                    to={"/"}
                    className="absolute m-4 top-0 right-0 text-sm font-semibold text-goldenrod-500 py-2 px-5 rounded-full border border-gray-600 bg-gray-800"
                >
                    <Home />
                </Link>
            </div>
            <Toaster />
        </div>
    );
};

export default Login;
