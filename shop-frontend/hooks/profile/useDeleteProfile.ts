import { useState, useRef, useEffect } from "react";
import { validatePasswordFormat } from "../../utils/validatePasswordFormat";
import { deleteProfileApi } from "../../api/profile/deleteProfile"

export function useDeleteProfile() {
    const [password, setPassword] = useState("");
    const [fieldError, setFieldError] = useState("");
    const [loading , setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [alert, setAlert] = useState<{type: "success" | "error", message: string} | null>(null);

    const alertRef = useRef<number | null>(null);

    useEffect(() => {
        if (password.length < 6) return;

        setFieldError(!validatePasswordFormat(password) ? "Password should be 8 symbols long, have one number and upper case letter" : "");

    }, [password]);

    const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputPassword = e.target.value;

        setPassword(inputPassword);
    };

    const deleteAccount = async (): Promise<boolean> => {
        try {
            setLoading(true);

            const deleteAcc = confirm("Are you sure you want to delete your account?");

            if (!deleteAcc) return false;

            if (password.length < 8) {
                showAlert("error", "Password should be at least 8 symbols long");
                return false;
            }

            const res = await deleteProfileApi(password);

            if (!res) {
                showAlert("error", "Wasn't able to delete your account");
                return false;
            }

            showAlert("success", "Account was successfully deleted. You will be redirected in 5 seconds...");
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
    }

    const togglePassword = () => setShowPassword(!showPassword);

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
        password,
        fieldError,
        loading,
        alert,
        showPassword,
        togglePassword,
        onPasswordChange,
        deleteAccount,
        removeAlert
    }

}