import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useAuth();

  if (!user || !user.token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    alert('Anda tidak memiliki akses ke halaman ini!');
    return <Navigate to="/" replace />; 
  }

  return <Outlet />;
};

ProtectedRoute.propTypes = {
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
};

export default ProtectedRoute;