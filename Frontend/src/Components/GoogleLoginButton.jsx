import React from 'react';
import { FaGoogle } from 'react-icons/fa';

const GoogleLoginButton = ({ text = "Continue with Google" }) => {
    const handleGoogleLogin = () => {
        // Redirect to backend Google OAuth endpoint
        window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
    };

    return (
        <button
            onClick={handleGoogleLogin}
            type="button"
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors group"
        >
            <FaGoogle className="text-red-500 text-xl mr-3" />
            <span className="text-gray-700 dark:text-gray-200 font-medium">{text}</span>
        </button>
    );
};

export default GoogleLoginButton;
