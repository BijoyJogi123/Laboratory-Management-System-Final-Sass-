import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

        // Decode JWT to check expiration
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;

        if (tokenPayload.exp < currentTime) {
          // Token expired
          localStorage.removeItem('token');
          setIsAuthenticated(false);
          setUser(null);
        } else {
          // Token is valid
          setIsAuthenticated(true);
          setUser({
            userId: tokenPayload.userId,
            email: tokenPayload.email,
          });
        }
      } catch (error) {
        console.error('Auth check error:', error);
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      // Use regular axios for login (not the api instance with interceptor)
      const response = await api.post('/auth/login-user', {
        email,
        password,
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);

        // Decode token to get user info
        const tokenPayload = JSON.parse(atob(response.data.token.split('.')[1]));
        setUser({
          userId: tokenPayload.userId,
          email: tokenPayload.email,
        });
        setIsAuthenticated(true);

        toast.success('Login successful!');
        return { success: true };
      }
    } catch (error) {
      console.error('Login error:', error);
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
