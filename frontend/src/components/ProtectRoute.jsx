import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectRoute = ({ role }) => {
    const { user, isAuthenticated, isLoading } = useSelector(state => state.auth);
    const { theme } = useSelector(state => state.theme);
    const darkMode = theme === "dark";

    if (isLoading) {
        return (
            <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
                darkMode ? 'bg-gray-900' : 'bg-white'
            }`}>
                <div className="flex flex-col items-center gap-4">
                    {/* Spinner */}
                    <div className="relative w-16 h-16">
                        <div className="absolute inset-0 border-4 border-transparent border-t-orange-500 rounded-full animate-spin"></div>
                    </div>
                    {/* Loading Text */}
                    <p className={`text-lg font-medium ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                        Loading...
                    </p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (role && !user?.roles?.includes(role)) {
        return <Navigate to="/products" replace />;
    }

    return <Outlet />;
};

export default ProtectRoute;