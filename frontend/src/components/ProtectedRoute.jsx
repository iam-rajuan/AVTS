import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const homeByRole = {
  user: '/user/home',
  captain: '/captain/home',
};

const loginByRole = {
  user: '/login?role=user',
  captain: '/login?role=captain',
};

const ProtectedRoute = ({ allowedRole, children }) => {
  const { session, refreshProfile, clearSession } = useAuth();
  const [isChecking, setIsChecking] = useState(true);
  const [resolvedRole, setResolvedRole] = useState(session.role || '');
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;

    async function verify() {
      if (!session.token) {
        if (isMounted) {
          setIsChecking(false);
          setResolvedRole('');
        }
        return;
      }

      try {
        if (session.profile && session.role === allowedRole) {
          if (isMounted) {
            setResolvedRole(session.role);
            setIsChecking(false);
          }
          return;
        }

        const authData = await refreshProfile();
        if (isMounted) {
          setResolvedRole(authData?.role || '');
          setIsChecking(false);
        }
      } catch (error) {
        clearSession();
        if (isMounted) {
          setResolvedRole('');
          setIsChecking(false);
        }
      }
    }

    verify();

    return () => {
      isMounted = false;
    };
  }, [session.token, session.role, session.profile, refreshProfile, clearSession]);

  if (isChecking) {
    return <div className="min-h-screen grid place-items-center">Loading...</div>;
  }

  if (!session.token || !resolvedRole) {
    return <Navigate to={loginByRole[allowedRole] || '/login'} replace state={{ from: location }} />;
  }

  if (resolvedRole !== allowedRole) {
    return <Navigate to={homeByRole[resolvedRole] || '/'} replace />;
  }

  return children;
};

export default ProtectedRoute;
