import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';

const AdminRoute = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;

  const isAdmin = user?.roles?.includes('Admin');
  return isAdmin ? <Outlet /> : <Navigate to="/" replace />;
};

export default AdminRoute;
