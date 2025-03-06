'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export interface AuthContextType {
  isLoggedIn: boolean;
  login: (email: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  login: async () => {},
  logout: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = async (email: string) => {
    setIsLoggedIn(true);
    // ... any other login logic
  };

  const logout = () => {
    setIsLoggedIn(false);
    // ... any other logout logic
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);