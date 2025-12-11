import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { useSelector } from 'react-redux';

const NotFoundPage = () => {
    const navigate = useNavigate();
    const theme = useSelector(state => state.theme.theme);
    const darkMode = theme === "dark";

    return (
        <div className={`flex flex-1 items-center justify-center px-4 
            ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
            
            <div className="max-w-lg w-full text-center">
                
                {/* 404 Number */}
                <div className="mb-8">
                    <h1 className={`text-9xl font-bold animate-pulse 
                        ${darkMode ? "text-orange-500" : "text-orange-400"}`}>
                        404
                    </h1>
                </div>

                {/* Error Message */}
                <div className="mb-8">
                    <h2 className={`text-3xl font-semibold mb-4 
                        ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
                        Page Not Found
                    </h2>

                    <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} text-lg`}>
                        Oops! The page you're looking for doesn't exist or has been moved.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">

                    {/* Back Button */}
                    <button
                        onClick={() => navigate(-1)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium
                            transition-colors duration-200 cursor-pointer
                            ${darkMode 
                                ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                            }`}
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Go Back
                    </button>

                    {/* Home Button */}
                    <button
                        onClick={() => navigate('/')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium
                            transition-colors duration-200 cursor-pointer
                            ${darkMode
                                ? "bg-orange-400 hover:bg-orange-500 text-white"
                                : "bg-orange-500 hover:bg-orange-600 text-white"

                            }`}
                    >
                        <Home className="w-5 h-5" />
                        Go Home
                    </button>
                </div>

                {/* Decorative Dots */}
                <div className="mt-12 flex justify-center gap-2">
                    {[0, 150, 300].map((delay, idx) => (
                        <div
                            key={idx}
                            className={`w-3 h-3 rounded-full animate-bounce 
                                ${darkMode ? "bg-orange-400" : "bg-orange-500"}`}
                            style={{ animationDelay: `${delay}ms` }}
                        ></div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;
