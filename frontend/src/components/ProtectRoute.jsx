import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { CustomLoading } from "./LoadingSkeleton";

const ProtectRoute = ({ role }) => {
    const { user, isAuthenticated, isLoading } = useSelector(state => state.auth);
    const { theme } = useSelector(state => state.theme);
    const darkMode = theme === "dark";

    if (isLoading) {
        return (
            <CustomLoading darkMode={darkMode} />
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