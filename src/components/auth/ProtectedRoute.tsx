import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import type { UserRole } from '../../store/slices/authSlice';

interface ProtectedRouteProps {
    allowedRoles: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
    const { isAuthenticated, role, token } = useAppSelector((state) => state.auth);

    if (!isAuthenticated || !token || !role) {
        if (allowedRoles.includes('ADMIN')) {
            return <Navigate to="/admin/login" replace />;
        }
        return <Navigate to="/agent/login" replace />;
    }

    if (!allowedRoles.includes(role)) {
        // Redirect based on role if they try to access unauthorized area
        if (role === 'ADMIN') {
            return <Navigate to="/admin" replace />;
        }
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
