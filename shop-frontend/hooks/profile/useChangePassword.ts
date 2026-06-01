import { useEffect, useState, useRef } from "react";
import type { PasswordFieldErrors } from "../../types/fieldErrors";
import { validatePasswordFormat } from "../../utils/validatePasswordFormat";
import { changePasswordApi } from "../../api/profile/changePasswordApi";

export function useChangePassword() {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [showPassword, setShowPassword] = useState<{old: true | false, new: true | false, newRepeated: true | false}>({
        old: false,
        new: false,
        newRepeated: false
    });
    const [newRepeatedPassword, setNewRepeatedPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState<{type: "success" | "error", message: string} | null>(null);
    const [fieldErrors, setFieldErrors] = useState<PasswordFieldErrors>({
        oldPassword: "",
        newPassword: "",
        newRepeatedPassword: ""
    });

    const alertRef = useRef<number | null>(null);

    useEffect(() => {
        if (newPassword === oldPassword && (newPassword && oldPassword)) {
            return setFieldErrors(prev => ({
                ...prev,
                newPassword: "New password is exactly the same as old password"
            }));
        }

        if (newPassword.length > 3) {
            setFieldErrors(prev => ({
                ...prev,
                newPassword: validatePasswordFormat(newPassword) === false ? "Password must contain one upper case letter, one number and be 8 symbols long" : ""
            }));
        }

        if (newPassword && newRepeatedPassword.length >= 5) {
            setFieldErrors(prev => ({
                ...prev,
                newRepeatedPassword: newPassword !== newRepeatedPassword ? "Repeated password is not exactly the same as a new password" : ""
            }));
        }
    }, [oldPassword, newPassword, newRepeatedPassword]);

    const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>, which: "old"| "new" | "newRepeated") => {
        const password = e.target.value;

        if (which === "old") {
            setOldPassword(password);

        } else if (which === "new") {
            setNewPassword(password);

        } else {
            setNewRepeatedPassword(password);

        }
    };

    const changePassword = async (): Promise<boolean> => {
        try {
            setLoading(true);

            if (!oldPassword && newPassword.length < 4 && !newRepeatedPassword) {
                showAlert("error", "Required fields are empty");
                return false;
            }

            for (const [key, value] of Object.entries(fieldErrors)) {
                if (value !== "") {
                    showAlert("error", `Error: ${value}`);
                    return false;
                }
            }

            const res = await changePasswordApi(oldPassword, newPassword);

            if (!res) {
                showAlert("error", "Old password is incorrect")
                return false;
            }

            return true;            

        } catch (err) {
            if (err instanceof Error) {
                showAlert("error", err.message);
            } else {
                showAlert("error", "Something went wrong");
            }

            return false;

        } finally {
            setLoading(false);

        }
    };

    const onTogglePassword = (which: "old" | "new" | "newRepeated") => {
        if (which === "old") {
            setShowPassword(prev => ({
                ...prev,
                old: !showPassword.old
            }));
        } else if (which === "new") {
            setShowPassword(prev => ({
                ...prev,
                new: !showPassword.new
            }));
        } else {
            setShowPassword(prev => ({
                ...prev,
                newRepeated: !showPassword.newRepeated
            }));
        }
    };

    const showAlert = (type: "success" | "error", message: string) => {
        setAlert({type: type, message: message});

        if (alertRef.current) {
            clearTimeout(alertRef.current);
        }

        alertRef.current = setTimeout(() => {
            removeAlert();
        }, 5000);
    };

    const removeAlert = () => setAlert(null);

    return {
        oldPassword,
        newPassword,
        newRepeatedPassword,
        loading,
        alert,
        showPassword,
        fieldErrors,
        removeAlert,
        onTogglePassword,
        onPasswordChange,
        changePassword
    };
}