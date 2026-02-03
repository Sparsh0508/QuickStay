import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const ProtectedRoute = ({ children }) => {
    const { token, isOwner } = useAppContext();
    const { pathname } = useLocation();

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (pathname.includes("/owner") && !isOwner) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
