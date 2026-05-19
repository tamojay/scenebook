import { createContext, useEffect, useState, type ReactNode } from "react";
import { authApi } from "@/lib/api/auth";
import type { User, LoginInput, SignupInput } from "./types";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (input: LoginInput) => Promise<void>;
  signup: (input: SignupInput) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Hydrate from localStorage on mount
  useEffect(() => {
    setUser(authApi.getCurrentUser());
    setIsLoading(false);
  }, []);

  const login = async (input: LoginInput) => {
    const user = await authApi.login(input);
    setUser(user);
  };

  const signup = async (input: SignupInput) => {
    const user = await authApi.signup(input);
    setUser(user);
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
