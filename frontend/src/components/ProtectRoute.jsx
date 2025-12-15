import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectRoute = ({ role }) => {
    const { user, isAuthenticated, isLoading } = useSelector(s => s.auth);

    if (isLoading) return <p>Loading...</p>;

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (role && !user?.roles?.includes(role)) {
        return <Navigate to="/products" replace />;
    }

    return <Outlet />;
};

export default ProtectRoute
