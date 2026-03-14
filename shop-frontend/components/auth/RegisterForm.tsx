import { EUROPEAN_COUNTRIES } from "../../data/countries";
import type { FieldErrors } from "../../types/fieldErrors";

interface RegisterFormProps {
    username: string;
    email: string;
    password: string;
    fullname: string;
    phone: string;
    phonePrefix: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    postalCode: string;
    showPassword: boolean;
    loading: boolean;
    error: string | null;
    fieldErrors: FieldErrors;
    onUsernameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onFullnameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onPhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onAddressLine1Change: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onAddressLine2Change: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onCountryChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onCityChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onPostalCodeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onTogglePassword: () => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    onNavigateToLogin: () => void;
}

export default function RegisterForm({
    username,
    email,
    password,
    fullname,
    phone,
    phonePrefix,
    addressLine1,
    addressLine2,
    city,
    postalCode,
    showPassword,
    loading,
    error,
    fieldErrors,
    onUsernameChange,
    onEmailChange,
    onPasswordChange,
    onFullnameChange,
    onPhoneChange,
    onAddressLine1Change,
    onAddressLine2Change,
    onCountryChange,
    onCityChange,
    onPostalCodeChange,
    onTogglePassword,
    onSubmit,
    onNavigateToLogin
}: RegisterFormProps) {
  return (
    <div className="auth-container fade-in">
        <h2>Create Account</h2>

        <form className="auth-form" onSubmit={onSubmit}>
            <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                    id="username"
                    type="text"
                    value={username}
                    placeholder="Enter username..."
                    autoComplete="username"
                    required
                    minLength={6}
                    maxLength={50}
                    onChange={onUsernameChange}
                />
                {fieldErrors.username && (
                    <span className="field-error">{fieldErrors.username}</span>
                )}
            </div>

            <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    placeholder="Enter email..."
                    autoComplete="email"
                    required
                    maxLength={255}
                    onChange={onEmailChange}
                />
                {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
            </div>

            <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="password-wrapper">
                    <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        placeholder="Create a password..."
                        autoComplete="new-password"
                        required
                        minLength={8}
                        maxLength={255}
                        onChange={onPasswordChange}
                    />

                    <button
                        type="button"
                        className="toggle-password"
                        onClick={onTogglePassword}
                    >
                        {showPassword ? "Hide" : "Show"}
                    </button>
                    {fieldErrors.password && <span className="field-error">{fieldErrors.password}</span>}
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="country">Country</label>
                <select id="country" autoComplete="country" name="country" onChange={onCountryChange}>
                    <option key="initial-value" value="initial-value">
                        Select country
                    </option>
                    {EUROPEAN_COUNTRIES.map(country => (
                        <option key={country.code} value={country.code}>
                            {country.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                    id="city"
                    type="text"
                    value={city}
                    placeholder="Enter city name.."
                    autoComplete="city"
                    maxLength={100}
                    onChange={onCityChange}
                />
            </div>

            <div className="form-group">
                <label htmlFor="postalCode">Postal code</label>
                <input
                    id="postalCode"
                    type="text"
                    value={postalCode}
                    placeholder="Enter postal code.."
                    autoComplete="postalCode"
                    maxLength={20}
                    onChange={onPostalCodeChange}
                />
            </div>

            <div className="form-group">
                <label htmlFor="fullname">Full name</label>
                <input
                    id="fullname"
                    type="text"
                    value={fullname}
                    placeholder="Enter your full name..."
                    autoComplete="fullname"
                    maxLength={100}
                    onChange={onFullnameChange}
                />
            </div>

            <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <div className="phone-wrapper">
                    <span className="phone-prefix">{phonePrefix || "+?"}</span>
                    <input
                        id="phone"
                        type="tel"
                        value={phone}
                        placeholder="20 000 000"
                        maxLength={20}
                        onChange={onPhoneChange}
                    />
                </div>
                {fieldErrors.phone && <span className="field-error">{fieldErrors.phone}</span>}
            </div>

            <div className="form-group">
                <label htmlFor="addressLine1">First address line</label>
                <input
                    id="addressLine1"
                    type="text"
                    value={addressLine1}
                    placeholder="Enter your first address line..."
                    autoComplete="addressLine1"
                    maxLength={255}
                    onChange={onAddressLine1Change}
                />
            </div>

            <div className="form-group">
                <label htmlFor="addressLine2">Second address line</label>
                <input
                    id="addressLine2"
                    type="text"
                    value={addressLine2}
                    placeholder="Enter your second address line..."
                    autoComplete="addressLine2"
                    maxLength={255}
                    onChange={onAddressLine2Change}
                />
            </div>

            {error && <p className="error-message">{error}</p>}

            <button type="submit" className="auth-button" disabled={loading}>
                {loading ? "Signing up..." : "Sign Up"}
            </button>

        </form>

        <p className="auth-switch">
            Already have an account?
            <span onClick={onNavigateToLogin}>Log in here</span>
        </p>
    </div>
  );
}