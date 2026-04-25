import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CaptainLogout = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  useEffect(() => {
    async function logout() {
      await signOut();
      navigate('/login?role=captain', { replace: true });
    }

    logout();
  }, [navigate, signOut]);

  return <div className="min-h-screen grid place-items-center">Signing out...</div>;
};

export default CaptainLogout;
