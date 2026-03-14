import LoginForm from "../../components/auth/LoginForm";
import { useLoginForm } from "../../hooks/auth/useLoginForm";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { email, password, showPassword, loading, error, setEmail, setPassword, togglePassword, handleLogin } = useLoginForm();
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = await handleLogin();
    if (user) {
      login(user);
      navigate("/home");
    }
  };

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
      navigate={navigate}
    />
  );
}