'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import { type AuthContextType } from '@/types/auth';

export const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  currentUser: null,
  login: async () => {},
  logout: () => {},
});

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  const login = async (email: string) => {
    setIsLoggedIn(true);
    setCurrentUser(email);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  const contextValue: AuthContextType = {
    isLoggedIn,
    currentUser,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  return useContext(AuthContext);
}