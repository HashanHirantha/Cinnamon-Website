import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

const STORAGE_KEY = 'ceylone_user';
const TOKEN_KEY = 'ceylone_token';

const loadUser = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(loadUser);
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [loading, setLoading] = useState(true);

  // Validate session on mount
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem(TOKEN_KEY);
      if (savedToken) {
        try {
          const res = await authApi.getProfile();
          if (res.success && res.data) {
            setUser(res.data);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(res.data));
          }
        } catch (err) {
          console.warn('Session check failed or offline fallback:', err.message);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const signIn = useCallback(async ({ email, password }) => {
    if (!email || !password) throw new Error('Email and password are required');

    try {
      const res = await authApi.login({ email, password });
      if (res.success && res.data) {
        const { user: loggedInUser, token: authToken } = res.data;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(loggedInUser));
        localStorage.setItem(TOKEN_KEY, authToken);
        setUser(loggedInUser);
        setToken(authToken);
        return loggedInUser;
      }
    } catch (apiError) {
      // Fallback for offline development mode if backend server is not running
      if (apiError.message?.includes('Failed to fetch') || apiError.message?.includes('NetworkError')) {
        console.warn('Backend offline — using local fallback session');
        const fallbackUser = { email, name: email.split('@')[0], role: 'customer' };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(fallbackUser));
        setUser(fallbackUser);
        return fallbackUser;
      }
      throw apiError;
    }
  }, []);

  const signUp = useCallback(async ({ name, email, password, phone, country, ...rest }) => {
    if (!name || !email || !password) throw new Error('Name, email, and password are required');

    try {
      const res = await authApi.register({ name, email, password, phone, country });
      if (res.success && res.data) {
        const { user: registeredUser, token: authToken } = res.data;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(registeredUser));
        localStorage.setItem(TOKEN_KEY, authToken);
        setUser(registeredUser);
        setToken(authToken);
        return registeredUser;
      }
    } catch (apiError) {
      if (apiError.message?.includes('Failed to fetch') || apiError.message?.includes('NetworkError')) {
        console.warn('Backend offline — using local fallback registration');
        const fallbackUser = { email, name, phone, country, role: 'customer' };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(fallbackUser));
        setUser(fallbackUser);
        return fallbackUser;
      }
      throw apiError;
    }
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
    setToken(null);
  }, []);

  const updateProfile = useCallback(async (data) => {
    try {
      const res = await authApi.updateProfile(data);
      if (res.success && res.data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(res.data));
        setUser(res.data);
        return res.data;
      }
    } catch (err) {
      const updated = { ...user, ...data };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setUser(updated);
      return updated;
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, token, signIn, signUp, signOut, updateProfile, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
