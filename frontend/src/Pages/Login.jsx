import React from "react";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
    const [login, setLogin] = useState(true);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

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
        clearAuthError();
        console.log("Form submitted");

        try {
            if (!login) {
                await signup({ email, password, full_name: name }).unwrap();
                alert("Account created successfully!");
            } else {
                await signin({ email, password }).unwrap();
                alert("Logged in successfully!");
            }
        } catch (err) {
            console.error("Authentication error:", err);
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex h-[700px] w-full">
            <div className="w-full hidden md:inline-block">
                <img
                    className="h-full"
                    // src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/leftSideImage.png"
                    src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1965&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="leftSideImage"
                />
            </div>

            <div className="w-full flex flex-col items-center justify-center">
                <form
                    className="md:w-96 w-80 flex flex-col items-center justify-center"
                    onSubmit={handleSubmit}
                >
                    <h2 className="text-4xl text-gray-900 font-medium">
                        {login ? "Sign in" : "Sign up"}
                    </h2>
                    <p className="text-sm text-gray-500/90 mt-3">
                        {login
                            ? "Welcome back! Please sign in to continue"
                            : "Create an account to get started"}
                    </p>

                    {!login && (
                        <div className="flex items-center mt-8 w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2">
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M8 8C10.2091 8 12 6.20914 12 4C12 1.79086 10.2091 0 8 0C5.79086 0 4 1.79086 4 4C4 6.20914 5.79086 8 8 8ZM8 1.5C9.38071 1.5 10.5 2.61929 10.5 4C10.5 5.38071 9.38071 6.5 8 6.5C6.61929 6.5 5.5 5.38071 5.5 4C5.5 2.61929 6.61929 1.5 8 1.5Z"
                                    fill="#6B7280"
                                />
                                <path
                                    d="M2 14.5C2 11.4624 4.46243 9 7.5 9H8.5C11.5376 9 14 11.4624 14 14.5C14 15.3284 13.3284 16 12.5 16H3.5C2.67157 16 2 15.3284 2 14.5Z"
                                    fill="#6B7280"
                                />
                            </svg>
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                type="text"
                                placeholder="Full Name"
                                className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full"
                                required
                            />
                        </div>
                    )}

                    <div className="flex items-center mt-8 w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2">
                        <svg
                            width="16"
                            height="11"
                            viewBox="0 0 16 11"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M0 .55.571 0H15.43l.57.55v9.9l-.571.55H.57L0 10.45zm1.143 1.138V9.9h13.714V1.69l-6.503 4.8h-.697zM13.749 1.1H2.25L8 5.356z"
                                fill="#6B7280"
                            />
                        </svg>
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            placeholder="Email id"
                            className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full"
                            required
                        />
                    </div>

                    <div className="flex items-center mt-6 w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2">
                        <svg
                            width="13"
                            height="17"
                            viewBox="0 0 13 17"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M13 8.5c0-.938-.729-1.7-1.625-1.7h-.812V4.25C10.563 1.907 8.74 0 6.5 0S2.438 1.907 2.438 4.25V6.8h-.813C.729 6.8 0 7.562 0 8.5v6.8c0 .938.729 1.7 1.625 1.7h9.75c.896 0 1.625-.762 1.625-1.7zM4.063 4.25c0-1.406 1.093-2.55 2.437-2.55s2.438 1.144 2.438 2.55V6.8H4.061z"
                                fill="#6B7280"
                            />
                        </svg>
                        <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            placeholder="Password"
                            className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full"
                            required
                        />
                    </div>

                    <div className="w-full flex items-center justify-between mt-8 text-gray-500/80">
                        <div className="flex items-center gap-2">
                            <input
                                className="h-5"
                                type="checkbox"
                                id="checkbox"
                            />
                            <label className="text-sm" htmlFor="checkbox">
                                Remember me
                            </label>
                        </div>
                        <a className="text-sm underline" href="#">
                            Forgot password?
                        </a>
                    </div>

                    <button
                        type="submit"
                        className="mt-8 w-full h-11 rounded-full text-white bg-indigo-500 hover:opacity-90 transition-opacity"
                    >
                        {login ? "Login" : "Register"}
                    </button>
                    <p className="text-gray-500/90 text-sm mt-4">
                        {login
                            ? "Don't have an account?  "
                            : "Already have an account?  "}
                        <button
                            className="text-indigo-400 hover:underline"
                            onClick={() => setLogin(!login)}
                        >
                            {login ? "Sign up" : "Sign in"}
                        </button>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
