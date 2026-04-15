import "./OrderCreation.css";
import type { User } from "../../types/user";
import { EUROPEAN_COUNTRIES } from "../../data/countries";

interface OrderCreationFormProps {
    user: User | null;
    shippingName: string;
    shippingPhone: string;
    shippingAddressLine1: string;
    shippingAddressLine2: string;
    shippingCity: string;
    shippingPostalCode: string;
    shippingCountry: string;
    paymentMethod: string;
    customerNotes: string;
    alert: {type: "success" | "error", message: string} | null;
    loading: boolean;
    phoneError: string | null;
    onShippingNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onShippingPhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onShippingAddressLineChange: (addressNum: number, e: React.ChangeEvent<HTMLInputElement>) => void;
    onShippingCityChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onShippingPostalCodeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onShippingCountryChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onPaymentMethodChange: (method: string) => void;
    onCustomerNotesChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    onNavigateToLogin: () => void;
    removeAlert: () => void;
}

export function OrderCreationForm({
    user,
    shippingName,
    shippingPhone,
    shippingAddressLine1,
    shippingAddressLine2,
    shippingCity,
    shippingPostalCode,
    shippingCountry,
    paymentMethod,
    customerNotes,
    alert,
    loading,
    phoneError,
    onShippingNameChange,
    onShippingPhoneChange,
    onShippingAddressLineChange,
    onShippingCityChange,
    onShippingPostalCodeChange,
    onShippingCountryChange,
    onPaymentMethodChange,
    onCustomerNotesChange,
    onSubmit,
    onNavigateToLogin,
    removeAlert
}: OrderCreationFormProps) {

  if (!user) {
    return (
        <p>
            You're not logged in
            <br />
            <a onClick={onNavigateToLogin}>Click me to navigate to the login page</a>
        </p>
    );
  }

  return (
    <div className="order-container fade-in">
        <h2 className="order-title">Checkout</h2>

        {/* ALERT */}
        <div className="alert-container" onMouseEnter={removeAlert}>
        {alert && (
            <div className={`alert ${alert.type}`}>
            {alert.message}
            </div>
        )}
        </div>

        <form className="order-form" onSubmit={onSubmit}>

        {/* NAME */}
        <div className="form-group">
            <label htmlFor="sh-name">Full name</label>
            <input
            id="sh-name"
            type="text"
            value={shippingName}
            placeholder="John Doe"
            required
            maxLength={100}
            onChange={onShippingNameChange}
            />
        </div>

        {/* ADDRESS */}
        <div className="form-group">
            <label>Address</label>
            <input
            type="text"
            value={shippingAddressLine1}
            placeholder="Street, house..."
            required
            maxLength={255}
            onChange={(e) => onShippingAddressLineChange(1, e)}
            />
            <input
            type="text"
            value={shippingAddressLine2}
            placeholder="Apartment, etc. (optional)"
            maxLength={255}
            onChange={(e) => onShippingAddressLineChange(2, e)}
            />
        </div>

        {/* CITY + POSTAL */}
        <div className="form-row">
            <div className="form-group">
            <label>City</label>
            <input
                type="text"
                value={shippingCity}
                required
                onChange={onShippingCityChange}
            />
            </div>

            <div className="form-group">
            <label>Postal code</label>
            <input
                type="text"
                value={shippingPostalCode}
                required
                onChange={onShippingPostalCodeChange}
            />
            </div>
        </div>

        {/* COUNTRY */}
        <div className="form-group">
            <label>Country</label>
            <select
            onChange={onShippingCountryChange}
            value={shippingCountry || "initial-value"}
            >
            <option value="initial-value">Select country</option>
            {EUROPEAN_COUNTRIES.map((country) => (
                <option key={country.code} value={country.code}>
                {country.name}
                </option>
            ))}
            </select>
        </div>

        {/* PHONE */}
        <div className="form-group">
            <label>Phone</label>
            <input
            type="tel"
            value={shippingPhone}
            placeholder="+371 20000000"
            onChange={onShippingPhoneChange}
            />
            {phoneError && (
            <p className="form-error">{phoneError}</p>
            )}
        </div>

        {/* PAYMENT */}
        <div className="form-group">
            <label>Payment method</label>
            <div className="payment-methods">
            <div
                className={paymentMethod === "bank_transfer" ? "payment selected" : "payment"}
                onClick={() => onPaymentMethodChange("bank_transfer")}
            >
                Bank
            </div>

            <div
                className={paymentMethod === "digital_wallet" ? "payment selected" : "payment"}
                onClick={() => onPaymentMethodChange("digital_wallet")}
            >
                Wallet
            </div>

            <div
                className={paymentMethod === "cash" ? "payment selected" : "payment"}
                onClick={() => onPaymentMethodChange("cash")}
            >
                Cash
            </div>
            </div>
        </div>

        {/* NOTES */}
        <div className="form-group">
            <label>Notes</label>
            <textarea
            value={customerNotes}
            placeholder="Optional delivery instructions..."
            onChange={onCustomerNotesChange}
            maxLength={500}
            />
        </div>

        <button type="submit" className="pay-button" disabled={loading}>
            {loading ? "Processing..." : "Pay"}
        </button>

        </form>
    </div>
  );
}