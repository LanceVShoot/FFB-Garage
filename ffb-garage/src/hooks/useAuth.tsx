'use client';

import { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  user: string | null;
  login: (email: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    // Check for saved user email in localStorage on mount
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

  const login = async (email: string) => {
    // TODO: Add actual authentication logic here
    setUser(email);
    localStorage.setItem('user', email);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 