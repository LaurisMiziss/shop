import { createContext, useContext, useState } from "react";
import type { User } from "../types/user";
import { onLoginByTokenApi } from "../api/auth/onLoginByTokenApi";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  onLoginByToken: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (user: User) => {
    setUser(user);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  const onLoginByToken = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) return;

      const res = await onLoginByTokenApi(token);

      if (!res) return;

      login(res);

    } catch (err) {
      console.log(err);

    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      onLoginByToken,
      isAuthenticated: user !== null,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");

  return ctx;
}