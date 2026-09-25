import { createContext, useState } from 'react';

export const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('cyberclub_user');

    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (userData) => {
    setUser(userData);

    localStorage.setItem(
      'cyberclub_user',
      JSON.stringify(userData)
    );
  };

  const register = (userData) => {
    setUser(userData);

    localStorage.setItem(
      'cyberclub_user',
      JSON.stringify(userData)
    );
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cyberclub_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;