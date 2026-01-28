import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import type { RootState } from '../../store/store';

const PublicRoute: React.FC = () => {
    const { isAuthenticated, role } = useAppSelector((state: RootState) => state.auth);

    if (isAuthenticated) {
        if (role === 'ADMIN') {
            return <Navigate to="/admin" replace />;
        }
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default PublicRoute;
