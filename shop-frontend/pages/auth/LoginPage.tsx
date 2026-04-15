import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"
import { onLoginByTokenApi } from "../../api/auth/onLoginByTokenApi";
import { useLoginForm } from "../../hooks/auth/useLoginForm";;
import LoginForm from "../../components/auth/LoginForm";

export default function LoginPage() {
  const { email, password, showPassword, loading, error, setEmail, setPassword, togglePassword, handleLogin } = useLoginForm();
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const loadData = async () => {
        const user = await onLoginByTokenApi(token);
        if (user) {
          console.log(user)
          login(user);
          onNavigateToHome();
        }
      }

      loadData();
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = await handleLogin();
    if (user) {
      login(user);
      onNavigateToHome();
    }
  };

  const onNavigateToHome = () => navigate("/home");

  const onNavigateToRegister = () => navigate("/register");

  return (
    <LoginForm
      email={email}
      password={password}
      showPassword={showPassword}
      loading={loading}
      error={error}
      onEmailChange={(e) => setEmail(e.target.value)}
      onPasswordChange={(e) => setPassword(e.target.value)}
      onTogglePassword={togglePassword}
      onSubmit={handleSubmit}
      onNavigateToHome={onNavigateToHome}
      onNavigateToRegister={onNavigateToRegister}
    />
  );
}