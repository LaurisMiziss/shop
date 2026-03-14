import RegisterForm from "../../components/auth/RegisterForm";
import { useRegisterForm } from "../../hooks/auth/useRegisterForm";
import { useNavigate } from "react-router-dom";
import { handleChange } from "../../utils/handleChange";

export default function LoginPage() {
  const { 
    username, email, password, fullname, phone, phonePrefix, addressLine1, addressLine2, city, postalCode, showPassword, loading, error, fieldErrors,
    setUsername, setEmail, setFullname, setPhone, setAddressLine1, setAddressLine2, setCity, setPostalCode,
    togglePassword, handlePasswordChange, handleCountryChange, handleRegister 
} = useRegisterForm();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await handleRegister();
    if (res?.success) {
      navigate("/login");
    }
  };

  return (
    <RegisterForm
        username={username}
        email={email}
        password={password}
        fullname={fullname}
        phone={phone}
        phonePrefix={phonePrefix}
        addressLine1={addressLine1}
        addressLine2={addressLine2}
        city={city}
        postalCode={postalCode}
        showPassword={showPassword}
        loading={loading}
        error={error}
        fieldErrors={fieldErrors}
        onUsernameChange={handleChange(setUsername)}
        onEmailChange={handleChange(setEmail)}
        onPasswordChange={handlePasswordChange}
        onFullnameChange={handleChange(setFullname)}
        onPhoneChange={handleChange(setPhone)}
        onAddressLine1Change={handleChange(setAddressLine1)}
        onAddressLine2Change={handleChange(setAddressLine2)}
        onCountryChange={handleCountryChange}
        onCityChange={handleChange(setCity)}
        onPostalCodeChange={handleChange(setPostalCode)}
        onTogglePassword={togglePassword}
        onSubmit={handleSubmit}
        onNavigateToLogin={() => navigate("/login")}
    />
  );
}