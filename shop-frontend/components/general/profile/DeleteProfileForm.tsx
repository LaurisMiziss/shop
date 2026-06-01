import "./DeleteProfileForm.css";
import { Alert } from "../alert/Alert";

interface DeleteProfileFormProps {
    password: string;
    loading: boolean;
    alert: {type: "success" | "error", message: string} | null;
    showPassword: boolean;
    fieldError: string;
    removeAlert: () => void;
    onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    togglePassword: () => void;
    deleteAccount: (e: React.FormEvent) => void;
    onNavigateBack: () => void;
}

export function DeleteProfileForm({
    password,
    loading,
    alert,
    showPassword,
    fieldError,
    removeAlert,
    onPasswordChange,
    togglePassword,
    deleteAccount,
    onNavigateBack
}: DeleteProfileFormProps) {

    return (
        <div className="delete-acc-container">

            {/* ALERT */}
            <Alert alert={alert} onRemoveAlert={removeAlert} />

            <p className="warning-text">
                ⚠️ This action is permanent and cannot be undone.
            </p>

            <form onSubmit={deleteAccount}>

                <div className="delete-acc-form-heading">
                    <br />
                    <h2>Delete Account</h2>
                </div>

                <section className="delete-acc-form-section">
                    <div className="delete-acc-form-group">
                        <div className="input-wrapper">
                            <label htmlFor="password">Password:</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                placeholder="Enter your password..."
                                value={password}
                                onChange={onPasswordChange}
                                minLength={8}
                                maxLength={255}
                                disabled={loading}
                                required
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={togglePassword}
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                        {fieldError && (
                            <p className="error-text">{fieldError}</p>
                        )}
                    </div>
                </section>

                {/* MAIN BUTTONS */}
                <section className="form-section">
                    <div className="button-group">
                        <button type="button" disabled={loading} onClick={onNavigateBack} className="cancel-btn">
                            ← Return
                        </button>
                        <button type="submit" disabled={loading} className="delete-btn">
                            DELETE Account
                        </button>
                    </div>
                </section>

            </form>

        </div>
    );
}