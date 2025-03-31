export interface User {
  email: string;
}

export interface AuthContextType {
  isLoggedIn: boolean;
  login: () => Promise<void>;
  logout: () => void;
} 