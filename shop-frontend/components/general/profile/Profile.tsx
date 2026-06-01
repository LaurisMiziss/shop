import "./Profile.css";
import type { User } from "../../../types/user";
import { Spinner } from "../spinner/Spinner";
import { Alert } from "../alert/Alert";

interface ProfileProps {
    user: User | null;
    loading: boolean;
    alert: {type: "success" | "error", message: string} | null;
    removeAlert: () => void;
    onEditProfileClick: () => void;
    onNavigateToDeletePage: () => void;
    onNavigateToChangePassPage: () => void;
}

export function Profile({
    user,
    loading,
    alert,
    removeAlert,
    onEditProfileClick,
    onNavigateToDeletePage,
    onNavigateToChangePassPage
}: ProfileProps) {

    if (!user) {
        return (
            <p>
                Error 404
                <br />
                Profile with such ID is not found
            </p>
        );
    }

    if (loading) {
        return (
            <div>
                <Spinner size={32} />
            </div>
        );
    }

    return (
        <div className="profile-container">

            {/* ALERT */}
            <Alert alert={alert} onRemoveAlert={removeAlert} />

            {/* HEADER */}
            <div className="profile-header">
                <h2>{user.full_name || user.username}</h2>
                <button onClick={onEditProfileClick}>
                    Edit Profile →
                </button>
            </div>

            {/* ACCOUNT INFO */}
            <section className="profile-section">
                <h3>Account Info</h3>
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {user.role}</p>
                <p><strong>Created:</strong> {new Date(user.created_at).toLocaleString()}</p>
                <p>
                    <strong>Last Login:</strong>{" "}
                    {user.last_login
                        ? new Date(user.last_login).toLocaleString()
                        : "Never"}
                </p>
            </section>

            {/* PERSONAL INFO */}
            <section className="profile-section">
                <h3>Personal Info</h3>
                <p><strong>Full Name:</strong> {user.full_name || "-"}</p>
                <p><strong>Phone:</strong> {user.phone || "-"}</p>
            </section>

            {/* ADDRESS */}
            <section className="profile-section">
                <h3>Address</h3>
                <p>{user.address_line1 || "-"}</p>
                {user.address_line2 && <p>{user.address_line2}</p>}
                <p>
                    {user.city || "-"}, {user.postal_code || "-"}
                </p>
                <p>{user.country || "-"}</p>
            </section>
            
            <div className="profile-footer">
                <button type="button" onClick={onNavigateToChangePassPage} className="profile-edit-pass-btn">
                    ✏️ Change Password
                </button>
                <button type="button" onClick={onNavigateToDeletePage} className="profile-delete-btn">
                    🗑️ Delete Account
                </button>
            </div>

        </div>
    );
}