import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';
import { navigateTo } from '../utils/navigation';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user data exists in localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = async (emailId, password) => {
    try {
      const userData = await authService.login(emailId, password);
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      navigateTo('/');
    } catch (error) {
      throw error;
    }
  };

  const signup = async (userData) => {
    try {
      await authService.signup(userData);
      navigateTo('/login');
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      localStorage.removeItem('user');
      Cookies.remove('token');
      navigateTo('/login');
    } catch (error) {
      throw error;
    }
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 