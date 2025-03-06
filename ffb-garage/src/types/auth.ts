export interface AuthContextType {
  isLoggedIn: boolean;
  currentUser: string | null;
  login: (email: string) => Promise<void>;
  logout: () => void;
} 