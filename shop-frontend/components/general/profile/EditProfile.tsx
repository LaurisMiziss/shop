import "./EditProfile.css";
import type { User, UserFieldErrors } from "../../../types/user";
import { EUROPEAN_COUNTRIES } from "../../../data/countries";
import { Alert } from "../alert/Alert";
import { Spinner } from "../spinner/Spinner";

interface EditProfileProps {
    editUser: User | null;
    fieldErrors: UserFieldErrors;
    loading: boolean;
    alert: {type: "success" | "error", message: string} | null;
    onUsernameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onPhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onFullnameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onAddressLineChange: (e: React.ChangeEvent<HTMLInputElement>, number: 1 | 2) => void;
    onCityChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onPostalCodeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onCountryChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onSaveButtonClick: (e: React.FormEvent<HTMLFormElement>) => void;
    onUndoButtonClick: (field: "username" | "email" | "full_name" | "phone" | "address_line1" | "address_line2" | "city" | "postal_code" | "country" | undefined) => void;
    removeAlert: () => void;
    onEditProfileClick: () => void;
}

export function EditProfile({
    editUser,
    fieldErrors,
    loading,
    alert,
    onUsernameChange,
    onEmailChange,
    onPhoneChange,
    onFullnameChange,
    onAddressLineChange,
    onCityChange,
    onPostalCodeChange,
    onCountryChange,
    onSaveButtonClick,
    onUndoButtonClick,
    removeAlert,
    onEditProfileClick
}: EditProfileProps){

    if (loading) {
        return (
            <div>
                <Spinner size={32} />
            </div>
        );
    }

    if (!editUser) {
        return (
            <p>
                Error 404
                <br />
                Profile is not found
            </p>
        )
    }

    const allowedFields = ["username", "email", "full_name", "phone", "address_line1", "address_line2", "city", "postal_code", "country"] as const;

    type FieldName = typeof allowedFields[number];

    const fieldError = (field: string) => {
        const key = field as FieldName;

        return <span className="field-error">{fieldErrors[key]}</span>;
    };

    const undoButton = (field: "username" | "email" | "full_name" | "phone" | "address_line1" | "address_line2" | "city" | "postal_code" | "country" | undefined) => {
        return (
            <button type="button" onClick={() => onUndoButtonClick(field)} disabled={loading} className="action-btn">
                Undo Changes
            </button>
        );
    };

    return (
        <div className="profile-form-container">

            {/* ALERT */}
            <Alert alert={alert} onRemoveAlert={removeAlert} />

            <form onSubmit={onSaveButtonClick}>

                <div className="profile-form-heading">
                    <h2>Profile Editing</h2>
                    <button type="button" onClick={onEditProfileClick}>← Return</button>
                </div>

                <section className="form-section-profile">
                    <div className="form-group-profile">
                        <label htmlFor="edit-username">Username:</label>
                        <input
                            type="text"
                            id="edit-username"
                            placeholder="Enter a new username..."
                            value={editUser.username}
                            onChange={onUsernameChange}
                            minLength={6}
                            maxLength={50}
                            required
                        />
                        {fieldErrors.username && fieldError("username")}
                        {undoButton("username")}
                    </div>
                </section>

                <section className="form-section-profile">
                    <div className="form-group-profile">
                        <label htmlFor="edit-email">Email:</label>
                        <input
                            type="text"
                            id="edit-email"
                            placeholder="Enter a new email..."
                            value={editUser.email}
                            onChange={onEmailChange}
                            maxLength={255}
                            required
                        />
                        {fieldErrors.email && fieldError("email")}
                        {undoButton("email")}
                    </div>
                </section>

                <section className="form-section-profile">
                    <div className="form-group-profile">
                        <label htmlFor="edit-phone">Phone:</label>
                        <input
                            type="text"
                            id="edit-phone"
                            placeholder="Enter a new phone number..."
                            value={editUser.phone}
                            onChange={onPhoneChange}
                            minLength={6}
                            maxLength={50}
                        />
                        {fieldErrors.phone && fieldError("phone")}
                        {undoButton("phone")}
                    </div>
                </section>
                
                <section className="form-section-profile">
                    <div className="form-group-profile">
                        <label htmlFor="edit-fullname">Fullname:</label>
                        <input
                            type="text"
                            id="edit-fullname"
                            placeholder="Enter a new fullname..."
                            value={editUser.full_name}
                            onChange={onFullnameChange}
                            maxLength={100}
                        />
                        {fieldErrors.full_name && fieldError("full_name")}
                        {undoButton("full_name")}
                    </div>
                </section>

                <section className="form-section-profile">
                    <div className="form-group-profile">
                        <label htmlFor="edit-address-line-1">Address line 1:</label>
                        <input
                            type="text"
                            id="edit-address-line1"
                            placeholder="Enter a new first address line..."
                            value={editUser.address_line1}
                            onChange={(e) => onAddressLineChange(e, 1)}
                            maxLength={255}
                            disabled={loading}
                        />
                        {fieldErrors.address_line1 && fieldError("address_line1")}
                        {undoButton("address_line1")}
                    </div>
                </section>

                <section className="form-section-profile">
                    <div className="form-group-profile">
                        <label htmlFor="edit-address-line-2">Address line 2:</label>
                        <input
                            type="text"
                            id="edit-address-line2"
                            placeholder="Enter a new second address line..."
                            value={editUser.address_line2}
                            onChange={(e) => onAddressLineChange(e, 2)}
                            maxLength={255}
                            disabled={loading}
                        />
                        {fieldErrors.address_line2 && fieldError("address_line2")}
                        {undoButton("address_line2")}
                    </div>
                </section>

                <section className="form-section-profile">
                    <div className="form-group-profile">
                        <label htmlFor="edit-city">City:</label>
                        <input
                            type="text"
                            id="edit-city"
                            placeholder="Enter a new city..."
                            value={editUser.city}
                            onChange={onCityChange}
                            maxLength={100}
                            disabled={loading}
                        />
                        {fieldErrors.city && fieldError("city")}
                        {undoButton("city")}
                    </div>
                </section>

                <section className="form-section-profile">
                    <div className="form-group-profile">
                        <label htmlFor="edit-postal-code">Postal code:</label>
                        <input
                            type="text"
                            id="edit-postal-code"
                            placeholder="Enter a new postal code..."
                            value={editUser.postal_code}
                            onChange={onPostalCodeChange}
                            maxLength={20}
                            disabled={loading}
                        />
                        {fieldErrors.postal_code && fieldError("postal_code")}
                        {undoButton("postal_code")}
                    </div>
                </section>

                <section className="form-section-profile">
                    <div className="form-group-profile">
                        <label htmlFor="edit-country">Country:</label>
                        <select
                            id="edit-country" 
                            onChange={onCountryChange}
                            value={editUser.country ? editUser.country : "select-country"}
                            disabled={loading}
                        >
                            <option key="select-country">
                                Select country
                            </option>
                            {EUROPEAN_COUNTRIES.map((country) => {
                                return (
                                    <option key={country.code} value={country.code}>
                                        {country.name}
                                    </option>
                                );
                            })}
                        </select>
                        {fieldErrors.country && fieldError("country")}
                        {undoButton("country")}
                    </div>
                </section>

                {/* MAIN BUTTONS */}
                <section className="form-section">
                    <div className="button-group">
                        <button type="submit" disabled={loading} className="action-btn">
                            Save Changes
                        </button>
                        {undoButton(undefined)}
                    </div>
                </section>

            </form>

        </div>
    );
}