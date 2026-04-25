import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const dashboardByRole = {
  user: '/user/home',
  captain: '/captain/home',
  driver: '/captain/home',
};

const loginByRole = {
  user: '/login?role=user',
  captain: '/login?role=captain',
  driver: '/login?role=captain',
};

const LoadingScreen = () => (
  <div className="min-h-screen grid place-items-center bg-white text-gray-700">
    Loading...
  </div>
);

const normalizeAllowedRoles = (allowedRoles) => (
  Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles]
);

export const getDashboardForRole = (role) => dashboardByRole[role] || '/';

export const RoleProtectedRoute = ({ allowedRoles, children }) => {
  const { session, isAuthLoading } = useAuth();
  const location = useLocation();
  const roles = normalizeAllowedRoles(allowedRoles);

  if (isAuthLoading) {
    return <LoadingScreen />;
  }

  if (!session.token || !session.role) {
    return (
      <Navigate
        to={loginByRole[roles[0]] || '/login'}
        replace
        state={{ from: location }}
      />
    );
  }

  if (!roles.includes(session.role)) {
    return <Navigate to={getDashboardForRole(session.role)} replace />;
  }

  return children;
};

export const UserProtectedRoute = ({ children }) => (
  <RoleProtectedRoute allowedRoles="user">
    {children}
  </RoleProtectedRoute>
);

export const CaptainProtectedRoute = ({ children }) => (
  <RoleProtectedRoute allowedRoles={[ 'captain', 'driver' ]}>
    {children}
  </RoleProtectedRoute>
);

export const PublicRoute = ({ children }) => {
  const { session, isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return <LoadingScreen />;
  }

  if (session.token && session.role) {
    return <Navigate to={getDashboardForRole(session.role)} replace />;
  }

  return children;
};

export default RoleProtectedRoute;
