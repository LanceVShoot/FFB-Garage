export interface AuthContextType {
  isLoggedIn: boolean;
  login: (email: string) => Promise<void>;
  logout: () => void;
} 