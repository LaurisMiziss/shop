import "../general/ComponentDetails.css";
import type { User } from "../../../types/user";
import { Alert } from "../../general/alert/Alert";

interface UserDetailsProps {
    user: User | null;
    alert: {type: "success" | "error", message: string} | null;
    loading: boolean;
    onUndoClick: (field: "role" | undefined) => void;
    onUpdateUserClick: (e: React.FormEvent) => void;
    onRoleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    removeAlert: () => void;
}

export function UserDetails({
    user,
    alert,
    loading,
    onUndoClick,
    onUpdateUserClick,
    onRoleChange,
    removeAlert
}: UserDetailsProps) {

    if (!user) {
        return (
            <p>
                Error 404
                <br />
                User is not found
            </p>
        );
    }

    return (
        <div className="page">

            {/* ALERT */}
            <Alert alert={alert} onRemoveAlert={removeAlert} />

            <h2 className="page-title">
                {`Editing user with ID: ${user.id}`}
            </h2>

            <form onSubmit={onUpdateUserClick}>

                {/* USER ID */}
                <section className="form-section">
                    <div className="form-group">
                        <label htmlFor="user-id">User ID:</label>
                        <input
                            type="text"
                            id="user-id"
                            placeholder="345"
                            minLength={1}
                            value={user.id}
                            disabled={true}
                        />
                    </div>
                </section>

                {/* USERNAME */}
                <section className="form-section">
                    <div className="form-group">
                        <label htmlFor="user-username">Username:</label>
                        <input
                            type="text"
                            id="user-username"
                            placeholder="JeanGaultier123"
                            minLength={1}
                            value={user.username}
                            disabled={true}
                        />
                    </div>
                </section>

                {/* EMAIL*/}
                <section className="form-section">
                    <div className="form-group">
                        <label htmlFor="user-email">Email:</label>
                        <input
                            type="text"
                            id="user-email"
                            placeholder="jean.gaultier@gmail.com"
                            value={user.email}
                            disabled={true}
                        />
                    </div>
                </section>

                {/* ROLE */}
                <section className="form-section">
                    <div className="form-group">
                        <label htmlFor="user-role">Role:</label>
                        <select id="user-role" value={user.role} onChange={onRoleChange}>
                            <option value="customer">
                                Customer
                            </option>
                            <option value="admin">
                                Admin
                            </option>
                        </select>
                    </div>
                </section>

                {/* FULLNAME */}
                <section className="form-section">
                    <div className="form-group">
                        <label htmlFor="user-fullname">Fullname:</label>
                        <input
                            type="text"
                            id="user-fullname"
                            placeholder="Jean-Paul Gaultier"
                            value={user.full_name}
                            disabled={true}
                        />
                    </div>
                </section>

                {/* PHONE */}
                <section className="form-section">
                    <div className="form-group">
                        <label htmlFor="user-phone">Phone:</label>
                        <input
                            type="text"
                            id="user-phone"
                            placeholder="331456752"
                            value={user.phone}
                            disabled={true}
                        />
                    </div>
                </section>

                {/* ADDRESS LINE 1 */}
                <section className="form-section">
                    <div className="form-group">
                        <label htmlFor="user-address1">Address line 1:</label>
                        <input
                            type="text"
                            id="user-address1"
                            placeholder="Rue Crémieux"
                            value={user.address_line1}
                            disabled={true}
                        />
                    </div>
                </section>

                {/* ADDRESS LINE 2 */}
                <section className="form-section">
                    <div className="form-group">
                        <label htmlFor="user-address2">Address line 2:</label>
                        <input
                            type="text"
                            id="user-address2"
                            placeholder="Avenue des Champs-Élysées"
                            value={user.address_line2}
                            disabled={true}
                        />
                    </div>
                </section>
                
                {/* CITY */}
                <section className="form-section">
                    <div className="form-group">
                        <label htmlFor="user-city">City:</label>
                        <input
                            type="text"
                            id="user-city"
                            placeholder="Paris"
                            value={user.city}
                            disabled={true}
                        />
                    </div>
                </section>

                
                {/* POSTAL CODE */}
                <section className="form-section">
                    <div className="form-group">
                        <label htmlFor="user-postal">Postal code:</label>
                        <input
                            type="text"
                            id="user-postal"
                            placeholder="PARIS 01"
                            value={user.postal_code}
                            disabled={true}
                        />
                    </div>
                </section>

                {/* COUNTRY */}
                <section className="form-section">
                    <div className="form-group">
                        <label htmlFor="user-country">Country:</label>
                        <input
                            type="text"
                            id="user-country"
                            placeholder="FR"
                            value={user.country}
                            disabled={true}
                        />
                    </div>
                </section>

                {/* CREATED AT */}
                <section className="form-section">
                    <div className="form-group">
                        <label htmlFor="user-created">Created at:</label>
                        <input
                            type="text"
                            id="user-created"
                            placeholder="22.04.2017"
                            value={user.created_at}
                            disabled={true}
                        />
                    </div>
                </section>

                {/* CREATED AT */}
                <section className="form-section">
                    <div className="form-group">
                        <label htmlFor="user-last">Last login:</label>
                        <input
                            type="text"
                            id="user-last"
                            placeholder="26.04.2026"
                            value={user.last_login ? new Date(user.last_login).toLocaleString() : "null"}
                            disabled={true}
                        />
                    </div>
                </section>

                <div className="form-group">
                    <div className="button-group">
                        <button type="submit" disabled={loading} className="action-btn">
                            Update User
                        </button>
                        <button type="button" onClick={() => onUndoClick(undefined)} disabled={loading} className="action-btn">
                            Undo Changes
                        </button>
                    </div>
                </div>

            </form>

        </div>
    );
}