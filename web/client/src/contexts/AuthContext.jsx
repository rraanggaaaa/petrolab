import React, { createContext, useState, useEffect, useCallback } from 'react';
import { login as loginApi, register as registerApi, getCurrentUser, logout as logoutApi } from '../api/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    console.log('LoadUser - token exists:', !!token);

    if (!token) {
      setLoading(false);
      setIsAuthenticated(false);
      return;
    }

    try {
      const response = await getCurrentUser();
      console.log('LoadUser - response:', response);

      if (response.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        // Ensure user is stored
        localStorage.setItem('user', JSON.stringify(response.data.user));
      } else {
        console.warn('LoadUser failed:', response.message);
        logoutApi();
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error('Failed to load user:', err);
      logoutApi();
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email, password) => {
    setError(null);
    setLoading(true);

    try {
      const response = await loginApi({ email, password });
      console.log('Login context - response:', response);

      if (response.success) {
        // Token and user should already be saved in loginApi
        const userData = response.data.user;
        const token = response.data.token;

        // Double-check they are saved
        if (token) {
          localStorage.setItem('token', token);
        }
        if (userData) {
          localStorage.setItem('user', JSON.stringify(userData));
        }

        setUser(userData);
        setIsAuthenticated(true);

        console.log('Login context - user set:', userData);
        return { success: true, user: userData };
      } else {
        setError(response.message || 'Login failed');
        return { success: false, error: response.message };
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, email, password, role = 'user') => {
    setError(null);
    setLoading(true);

    try {
      const response = await registerApi({ username, email, password, role });

      if (response.success) {
        const userData = response.data.user;
        const token = response.data.token;

        if (token) {
          localStorage.setItem('token', token);
        }
        if (userData) {
          localStorage.setItem('user', JSON.stringify(userData));
        }

        setUser(userData);
        setIsAuthenticated(true);

        return { success: true, user: userData };
      } else {
        setError(response.message || 'Registration failed');
        return { success: false, error: response.message };
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Registration failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    logoutApi();
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
    console.log('Logout context - user cleared');
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const clearError = () => {
    setError(null);
  };

  const hasRole = (role) => {
    return user?.role === role;
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
    clearError,
    hasRole,
    isAdmin,
    loadUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};