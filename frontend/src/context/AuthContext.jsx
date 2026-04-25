import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const TOKEN_KEY = 'token';
const ROLE_KEY = 'role';
const PROFILE_KEY = 'authProfile';

const getDefaultSession = () => ({
  token: localStorage.getItem(TOKEN_KEY) || '',
  role: '',
  profile: null,
});

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [session, setSessionState] = useState(getDefaultSession);
  const [isAuthLoading, setIsAuthLoading] = useState(Boolean(localStorage.getItem(TOKEN_KEY)));

  const persistSession = useCallback(({ token, role, profile }) => {
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
  }, []);

  const clearSession = useCallback(() => {
    persistSession({ token: '', role: '', profile: null });
  }, [persistSession]);

  const refreshProfile = useCallback(async (tokenOverride) => {
    const token = tokenOverride || localStorage.getItem(TOKEN_KEY);

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
    persistSession({
      token,
      role: authData.role,
      profile: authData.profile,
    });

    return authData;
  }, [clearSession, persistSession]);

  useEffect(() => {
    let isMounted = true;

    async function restoreSession() {
      const token = localStorage.getItem(TOKEN_KEY);

      if (!token) {
        if (isMounted) {
          setIsAuthLoading(false);
        }
        return;
      }

      try {
        await refreshProfile(token);
      } catch (error) {
        clearSession();
      } finally {
        if (isMounted) {
          setIsAuthLoading(false);
        }
      }
    }

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, [clearSession, refreshProfile]);

  const setSession = useCallback((authData) => {
    persistSession(authData);
    setIsAuthLoading(false);
  }, [persistSession]);

  const signOut = useCallback(async () => {
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
  }, [clearSession, session.token]);

  const value = useMemo(() => ({
    session,
    setSession,
    clearSession,
    refreshProfile,
    signOut,
    isAuthLoading,
    isAuthenticated: Boolean(session.token && session.role),
  }), [clearSession, isAuthLoading, refreshProfile, session, setSession, signOut]);

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
