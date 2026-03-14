import type { NavigateFunction } from "react-router-dom";

interface LoginFormProps {
  email: string;
  password: string;
  showPassword: boolean;
  loading: boolean;
  error: string | null;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTogglePassword: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  navigate: NavigateFunction;
}

export default function LoginForm({
  email,
  password,
  showPassword,
  loading,
  error,
  onEmailChange,
  onPasswordChange,
  onTogglePassword,
  onSubmit,
  navigate,
}: LoginFormProps) {
  return (
    <div className="auth-container fade-in">
      <h2>Log In</h2>

      <form className="auth-form" onSubmit={onSubmit}>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            placeholder="Enter your email"
            autoComplete="email"
            required
            onChange={onEmailChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className="password-wrapper">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
              onChange={onPasswordChange}
            />
            <button type="button" className="toggle-password" onClick={onTogglePassword}>
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? "Logging in..." : "Log In"}
        </button>

      </form>

      <p className="auth-switch">
        Don't have an account?{" "}
        <span onClick={() => navigate("/register")}>Register here</span>
      </p>
    </div>
  );
}