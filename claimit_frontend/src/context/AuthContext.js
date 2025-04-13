import React, { createContext, useState } from 'react';

// Create context to manage auth state globally
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Initialize auth token from localStorage (if previously saved)
  const [authToken, setAuthToken] = useState(localStorage.getItem('jwt_token') || null);

  // Save auth token function (updates localStorage and state)
  const saveAuthToken = (token) => {
    localStorage.setItem('jwt_token', token);
    setAuthToken(token);
  };

  // Logout function - removes the token
  const logout = () => {
    localStorage.removeItem('jwt_token');
    setAuthToken(null);
  };

  return (
    <AuthContext.Provider value={{ authToken, saveAuthToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
