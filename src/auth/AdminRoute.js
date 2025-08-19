import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const AdminRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return <div>Loading...</div>; // or a spinner component
    }

    return user && user.role === 'admin' ? children : <Navigate to="/" replace />;
}

export default AdminRoute;