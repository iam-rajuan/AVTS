import React, { createContext, useContext, useMemo, useState } from 'react';
import axios from 'axios';

const TOKEN_KEY = 'token';
const ROLE_KEY = 'role';
const PROFILE_KEY = 'authProfile';

const getStoredProfile = () => {
  const value = localStorage.getItem(PROFILE_KEY);

  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch (error) {
    return null;
  }
};

const getDefaultSession = () => ({
  token: localStorage.getItem(TOKEN_KEY) || '',
  role: localStorage.getItem(ROLE_KEY) || '',
  profile: getStoredProfile(),
});

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [session, setSessionState] = useState(getDefaultSession);

  const setSession = ({ token, role, profile }) => {
    const nextSession = {
      token: token || '',
      role: role || '',
      profile: profile || null,
    };

    setSessionState(nextSession);

    if (nextSession.token) {
      localStorage.setItem(TOKEN_KEY, nextSession.token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }

    if (nextSession.role) {
      localStorage.setItem(ROLE_KEY, nextSession.role);
    } else {
      localStorage.removeItem(ROLE_KEY);
    }

    if (nextSession.profile) {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(nextSession.profile));
    } else {
      localStorage.removeItem(PROFILE_KEY);
    }
  };

  const clearSession = () => {
    setSession({ token: '', role: '', profile: null });
  };

  const refreshProfile = async (tokenOverride) => {
    const token = tokenOverride || session.token;

    if (!token) {
      clearSession();
      return null;
    }

    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const authData = response.data.data;
    setSession({
      token,
      role: authData.role,
      profile: authData.profile,
    });

    return authData;
  };

  const signOut = async () => {
    try {
      if (session.token) {
        await axios.post(
          `${import.meta.env.VITE_BASE_URL}/auth/logout`,
          {},
          {
            headers: {
              Authorization: `Bearer ${session.token}`,
            },
          }
        );
      }
    } catch (error) {
      // Always clear local auth state even if the backend logout request fails.
    } finally {
      clearSession();
    }
  };

  const value = useMemo(() => ({
    session,
    setSession,
    clearSession,
    refreshProfile,
    signOut,
    isAuthenticated: Boolean(session.token),
  }), [session]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};
