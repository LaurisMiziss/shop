import { useState } from "react";
import { onLoginApi } from "../../api/auth/onLoginApi";
import type { User } from "../../types/user";

export function useLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (): Promise<User | null> => {
    setLoading(true);
    setError(null);

    try {
        const user = await onLoginApi(email, password);

        if (!user) setError("Invalid credentials");

        return user;

    } catch (err) {
        console.log(err);
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError("Something went wrong");
        }
        return null;

    } finally {
        setLoading(false);
    }
  };

  return {
    email,
    password,
    showPassword,
    loading,
    error,
    setEmail,
    setPassword,
    togglePassword: () => setShowPassword(prev => !prev),
    handleLogin,
  };
}