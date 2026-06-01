import "./ChangePasswordForm.css";
import { PasswordFieldErrors } from "../../../types/fieldErrors";
import { Alert } from "../alert/Alert";

interface ChangePasswordFormProps {
    oldPassword: string;
    newPassword: string;
    newRepeatedPassword: string;
    loading: boolean;
    alert: {type: "success" | "error", message: string} | null;
    passwordFieldErrors: PasswordFieldErrors;
    showPassword: {old: true | false, new: true | false, newRepeated: true | false};
    onTogglePassword: (which: "old" | "new" | "newRepeated") => void;
    removeAlert: () => void;
    onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>, whichPassword: "old" | "new" | "newRepeated") => void;
    onSaveButtonClick: (e: React.FormEvent) => void;
    onNavigateToProfile: () => void;
}

export function ChangePasswordForm({ 
    oldPassword,
    newPassword,
    newRepeatedPassword,
    loading,
    alert,
    showPassword,
    passwordFieldErrors,
    onTogglePassword,
    removeAlert,
    onPasswordChange,
    onSaveButtonClick,
    onNavigateToProfile
}: ChangePasswordFormProps) {
    
    return (
        <div className="change-pass-container">

            <form onSubmit={onSaveButtonClick}>

                {/* ALERT */}
                <Alert alert={alert} onRemoveAlert={removeAlert} />

                <div className="change-pass-form-heading">
                    <h2>Change Password</h2>
                </div>

                <section className="change-pass-form-section">
                    <div className="change-pass-form-group">
                        <div className="input-wrapper">
                            <label htmlFor="old-password">Current Password:</label>
                            <input
                                type={showPassword.old ? "text" : "password"}
                                id="old-password"
                                placeholder="Enter your current password..."
                                value={oldPassword}
                                onChange={(e) => onPasswordChange(e, "old")}
                                minLength={8}
                                maxLength={255}
                                disabled={loading}
                                required
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => onTogglePassword("old")}
                            >
                                {showPassword.old ? "Hide" : "Show"}
                            </button>
                        </div>
                        {passwordFieldErrors.oldPassword && <p className="error-text">{passwordFieldErrors.oldPassword}</p>}
                    </div>
                </section>

                <section className="change-pass-form-section">
                    <div className="change-pass-form-group">
                        <div className="input-wrapper">
                            <label htmlFor="new-password">New Password:</label>
                            <input
                                type={showPassword.new ? "text" : "password"}
                                id="new-password"
                                placeholder="Enter a new password"
                                value={newPassword}
                                onChange={(e) => onPasswordChange(e, "new")}
                                minLength={8}
                                maxLength={255}
                                disabled={loading}
                                required
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => onTogglePassword("new")}
                            >
                                {showPassword.new ? "Hide" : "Show"}
                            </button>
                        </div>
                        {passwordFieldErrors.newPassword && (
                            <p className="error-text">{passwordFieldErrors.newPassword}</p>
                        )}
                    </div>
                </section>

                <section className="change-pass-form-section">
                    <div className="change-pass-form-group">
                        <div className="input-wrapper">
                            <label htmlFor="new-repeated-password">Repeat New Password:</label>
                            <input
                                type={showPassword.newRepeated ? "text" : "password"}
                                id="new-repeated-password"
                                placeholder="Enter a new password..."
                                value={newRepeatedPassword}
                                onChange={(e) => onPasswordChange(e, "newRepeated")}
                                minLength={8}
                                maxLength={255}
                                disabled={loading}
                                required
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => onTogglePassword("newRepeated")}
                            >
                                {showPassword.newRepeated ? "Hide" : "Show"}
                            </button>
                        </div>
                        {passwordFieldErrors.newRepeatedPassword && (
                            <p className="error-text">{passwordFieldErrors.newRepeatedPassword}</p>
                        )}
                    </div>
                </section>

                {/* MAIN BUTTONS */}
                <section className="form-section">
                    <div className="button-group">
                        <button type="button" disabled={loading} onClick={onNavigateToProfile} className="cancel-btn">
                            ← Return
                        </button>
                        <button type="submit" disabled={loading} className="action-btn">
                            Save Password
                        </button>
                    </div>
                </section>

            </form>

        </div>
    );
}