import React, { createContext, useState } from 'react';
import { login as loginApi } from '../api/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (email, password) => {
    setError(null);
    setLoading(true);
    
    try {
      console.log('📝 Login attempt:', email);
      const response = await loginApi({ email, password });
      console.log('📦 Response:', response);
      
      if (response && response.success === true) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        console.log('✅ Login success:', response.data.user.username);
        return { success: true, user: response.data.user };
      } else {
        const errorMsg = response?.message || 'Login failed';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (err) {
      const errorMessage = err?.message || 'Login failed';
      console.error('❌ Error:', errorMessage);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};