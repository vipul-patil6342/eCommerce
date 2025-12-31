import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { CustomLoading } from "./LoadingSkeleton";

const ProtectRoute = ({ role }) => {
    const { user, isAuthenticated, isLoading } = useSelector(state => state.auth);
    const { theme } = useSelector(state => state.theme);
    const darkMode = theme === "dark";

    return (
        <>
            {/* Overlay loader instead of early return */}
            {isLoading && <CustomLoading darkMode={darkMode} />}

            {!isAuthenticated && !isLoading && (
                <Navigate to="/login" replace />
            )}

            {isAuthenticated && role && !user?.roles?.includes(role) && (
                <Navigate to="/products" replace />
            )}

            {/* Keep routes mounted */}
            {isAuthenticated && <Outlet />}
        </>
    );
};

export default ProtectRoute;
