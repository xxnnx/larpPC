/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext } from 'react';



export const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export default function AuthProvider({ children }) {
  
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return Boolean(localStorage.getItem('token'));
  });

  
  const login = async (userData) => {
    try {
     
      const token = 'fake-jwt-token-123';

      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));

      
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Ошибка входа', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}