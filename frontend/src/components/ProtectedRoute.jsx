import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {

    const { isAuthenticated, isLoading } = useSelector(state => state.auth);

    if(isLoading){
        return <p>Loading...</p>;
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}

export default ProtectedRoute