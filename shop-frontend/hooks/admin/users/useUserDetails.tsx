import { useRef, useState } from "react";
import type { User } from "../../../types/user";
import { updateUserApi } from "../../../api/admin/users/updateUserApi";

export function useUserDetails() {
    const [oldRole, setOldRole] = useState<"customer" | "admin" | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [alert, setAlert] = useState<{type: "success" | "error", message: string} | null>(null);
    const [loading ,setLoading] = useState(false);

    const alertRef = useRef<number | null>(null);

    const onUndoClick = (field: "role" | undefined) => {
        if (!oldRole || !user) return;

        const doChanges = confirm(`Are you want to undo changes for field ${field ? field : ""}?`);
        if (!doChanges) return;

        setUser(prev => {
            if (!prev) return null;

            switch (field) {
                case "role":
                    return { ...prev, name: oldRole };

            default:
                return { ...prev, role: oldRole};
            };
        });
    };

    const updateUser = async (editingYourself: boolean) => {
        try {
            if (editingYourself) return showAlert("error", "You can't edit your own role");

            if (!user) return;
            
            const res = await updateUserApi(user.id, user.role);

            if (!res) return showAlert("error", "Something went wrong");

            showAlert("success", "User's role was successfully updated");

        } catch (err) {
            if (err instanceof Error) {
                showAlert("error", err.message);
            } else {
                showAlert("error", "Something went wrong");
            }

        } finally {
            setLoading(false);

        }
    }

    const handleUserChange = (user: User) => {
        setUser(user);
        setOldRole(user.role);
    };

    const onRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newRole = e.target.value;

        if (newRole !== "customer" && newRole !== "admin") return showAlert("error", "Invalid role");

        setUser(prev => {
            if (!prev) return null;
            return {
                ...prev,
                role: newRole
            };
        });
    };

    const showAlert = (type: "success" | "error", message: string) => {
        setAlert({type: type, message: message});

        if (alertRef.current) {
            clearTimeout(alertRef.current);
        }

        alertRef.current = setTimeout(() => {
            setAlert(null);
        }, 5000);
    };

    const removeAlert = () => setAlert(null);

    return {
        oldRole,
        user,
        alert,
        loading,
        onUndoClick,
        updateUser,
        onRoleChange,
        handleUserChange,
        removeAlert
    };
}