import { createContext, useContext, useState } from "react";
import type { User } from "../types/user";

// 1. describe what the context exposes to the rest of the app
interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

// 2. create the context with null as default
// null just means "no provider found above this component"
const AuthContext = createContext<AuthContextType | null>(null);

// 3. the provider — wraps your whole app, holds the actual state
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (user: User) => {
    setUser(user);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token"); // clean up token on logout
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated: user !== null, // derived value, not separate state
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// 4. custom hook so components never touch AuthContext directly
export function useAuth() {
  const ctx = useContext(AuthContext);

  // if someone uses useAuth() outside of AuthProvider, fail loudly
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");

  return ctx;
}