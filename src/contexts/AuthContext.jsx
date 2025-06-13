import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, isAuthenticated, cartAPI } from '../services/api';

const AuthContext = createContext();

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
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 檢查登入狀態
  useEffect(() => {
    const checkAuthStatus = async () => {
      if (isAuthenticated()) {
        try {
          const userData = await authAPI.getMe();
          setUser(userData);
          setIsLoggedIn(true);
        } catch (error) {
          console.error('Failed to get user data:', error);
          // Token可能已過期，清除它
          authAPI.logout();
          setUser(null);
          setIsLoggedIn(false);
        }
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (phone, password) => {
    try {
      const response = await authAPI.login(phone, password);
      const userData = await authAPI.getMe();
      setUser(userData);
      setIsLoggedIn(true);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const register = async (phone, password) => {
    try {
      const response = await authAPI.register(phone, password);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
    setIsLoggedIn(false);
  };

  const addToCart = async (item) => {
    try {
      const response = await cartAPI.addToCart(item);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const removeFromCart = async (cartId) => {
    try {
      const response = await cartAPI.removeFromCart(cartId);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const getCart = async (status = 'pending') => {
    try {
      const response = status === 'pending' 
        ? await cartAPI.getPendingCart() 
        : await cartAPI.getPurchasedCart();
      return response;
    } catch (error) {
      throw error;
    }
  };

  const checkoutItem = async (cartId) => {
    try {
      const response = await cartAPI.checkout(cartId);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    isLoggedIn,
    loading,
    login,
    register,
    logout,
    addToCart,
    removeFromCart,
    getCart,
    checkoutItem,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 