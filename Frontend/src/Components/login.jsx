import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../Store/AuthSlice";
import { useTheme } from "../context/ThemeContext";
import GoogleLoginButton from "./GoogleLoginButton";
import { FiMail, FiLock, FiUser, FiDollarSign, FiArrowLeft, FiSun, FiMoon } from "react-icons/fi";
import { FaApple } from "react-icons/fa";

export default function Login() {
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [message, setMessage] = useState("");
    const [rememberMe, setRememberMe] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector(state => state.auth);
    const { darkMode, toggleDarkMode } = useTheme();

    function submitLogin(e) {
        e.preventDefault();

        if (username === "" || password === "") {
            setMessage("Please fill in all fields.");
            return;
        }

        // Dispatch login with backend API
        dispatch(loginUser({ email: username, password }))
            .unwrap()
            .then(() => {
                setMessage("Login successful!");
                navigate("/dashboard");
            })
            .catch((error) => {
                setMessage(error || "Invalid credentials.");
            });
    }

    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            {/* Left Side - Brand & Info */}
            <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-700 dark:to-indigo-800 p-8 md:p-16 flex flex-col justify-between">
                <div>
                    <div className="flex items-center justify-between mb-12">
                        <div className="flex items-center">
                            <FiDollarSign size={32} className="text-white" />
                            <span className="text-white text-2xl font-bold ml-2">ExpensifyX</span>
                        </div>
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20"
                        >
                            {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
                        </button>
                    </div>
                    <div className="mt-16 text-white">
                        <h1 className="text-3xl md:text-4xl font-bold mb-6">
                            Take Control of Your Financial Journey
                        </h1>
                        <p className="text-lg md:text-xl opacity-90 mb-8 max-w-md">
                            Track expenses, visualize spending patterns, and achieve your financial goals with our intuitive dashboard.
                        </p>
                    </div>
                </div>

                {/* Testimonial */}
                <div className="mt-12 text-white rounded-xl bg-white/10 p-6 backdrop-blur-sm">
                    <p className="italic opacity-90 mb-4">
                        "ExpensifyX has completely transformed how I manage my finances. The visualization tools helped me cut unnecessary spending by 30% in just two months!"
                    </p>
                    <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-indigo-300 flex items-center justify-center text-indigo-700 font-medium">
                            AP
                        </div>
                        <div className="ml-3">
                            <p className="font-medium">Ajinkya Pathak</p>
                            <p className="text-sm opacity-80">Marketing Director</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full md:w-1/2 bg-white dark:bg-gray-900 p-8 md:p-16 flex flex-col justify-center">
                <div className="max-w-md mx-auto w-full">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back</h2>
                            <p className="mt-1 text-gray-600 dark:text-gray-400">Please enter your details to login</p>
                        </div>
                        <Link to="/" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center">
                            <FiArrowLeft size={16} className="mr-1" />
                            <span>Home</span>
                        </Link>
                    </div>

                    {message && (
                        <div className={`mb-4 p-3 rounded-md ${
                            message === "Login successful!" 
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
                                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                        }`}>
                            {message}
                        </div>
                    )}

                    <form onSubmit={submitLogin}>
                        <div className="mb-4">
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Username
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiUser className="text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="pl-10 w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                    placeholder="Enter your username"
                                />
                            </div>
                        </div>

                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-1">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Password
                                </label>
                                <a href="#" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                                    Forgot password?
                                </a>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiLock className="text-gray-400" />
                                </div>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-10 w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="flex items-center mb-6">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                checked={rememberMe}
                                onChange={() => setRememberMe(!rememberMe)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                Remember me for 30 days
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? "Logging in..." : "Sign in"}
                        </button>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                                    Or continue with
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-3">
                            <GoogleLoginButton text="Google" />
                            <button
                                type="button"
                                className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                                <FaApple className="mr-2" />
                                Apple
                            </button>
                        </div>
                    </div>

                    <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
                        Don't have an account?{" "}
                        <Link to="/signup" className="font-medium text-blue-600 dark:text-blue-400 hover:underline">
                            Sign up for free
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
