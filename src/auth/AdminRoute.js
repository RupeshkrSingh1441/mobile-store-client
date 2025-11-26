import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const AdminRoute = () => {
  //const { user, loading } = useContext(AuthContext);
  const { user,loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/login" replace />;
  const isAdmin = user.role[0] === 'Admin';
  //user.role?.includes("Admin");
  return isAdmin ? <Outlet /> : <Navigate to="/" replace />;
};

export default AdminRoute;
