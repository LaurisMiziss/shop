import { useEffect, useState, useRef } from "react";
import type { User, UserFieldErrors } from "../../types/user";
import { validateFieldApi } from "../../api/profile/validateFieldApi";
import { updateUserApi } from "../../api/profile/updateUserApi";

export function useProfile() {
    const [oldUser, setOldUser] = useState<User | null>(null);
    const [editUser, setEditUser] = useState<User | null>(null);
    const [fieldErrors, setFieldErrors] = useState<UserFieldErrors>({
        username: "",
        email: "",
        full_name: "",
        phone: "",
        address_line1: "",
        address_line2: "",
        city: "",
        postal_code: "",
        country: ""
    });
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState<{type: "success" | "error", message: string} | null>(null);    
    
    const alertRef = useRef<number | null>(null);

    const onUserChange = (user: User | null) => {
        if (!user) return;

        setEditUser(user);
        setOldUser(user);
    };

    useEffect(() => {
        if (!editUser || !oldUser) return;

        if (editUser.username === oldUser.username) {
            return setFieldErrors(prev => ({
                ...prev,
                username: ""
            }));
        }

        if (editUser.username.length <= 5) return;

        const timeout = setTimeout(async () => {
            const res = await validateField(editUser.username, "username");

            if (res === null) return;

            setFieldErrors(prev => ({
                ...prev,
                username: res ? "" : "This username is already taken"
            }));
        }, 500);

        return () => clearTimeout(timeout);

    }, [editUser?.username]);

    useEffect(() => {
        if (!editUser || !oldUser) return;

        if (editUser.email === oldUser.email) {
            return setFieldErrors(prev => ({
                ...prev,
                email: ""
            }));
        }

        if (editUser.email.length < 7) return;

        const timeout = setTimeout(async () => {
            const res = await validateField(editUser.email, "email");

            if (res === null) return;

            setFieldErrors(prev => ({
                ...prev,
                email: res ? "" : "This email is already taken"
            }));
        }, 500);

        return () => clearTimeout(timeout);

    }, [editUser?.email]);

    useEffect(() => {
        if (!editUser || !oldUser) return;

        if (editUser.phone === oldUser.phone) {
            setFieldErrors(prev => ({
                ...prev,
                phone: ""
            }));
        }

        if (editUser.phone.length < 6) return;

        const timeout = setTimeout(async () => {
            const res = await validateField(editUser.phone, "phone");

            if (res === null) return;

            setFieldErrors(prev => ({
                ...prev,
                phone: res ? "" : "This phone number is already taken"
            }));
        }, 500);

        return () => clearTimeout(timeout);

    }, [editUser?.phone]);

    const onUndoButtonClick = (field: "username" | "email" | "full_name" | "phone" | "address_line1" | "address_line2" | "city" | "postal_code" | "country" | undefined) => {
        if (!oldUser) return;

        const doChanges = confirm(`Are you want to undo changes for field ${field}?`);
        if (!doChanges) return;

        setEditUser(prev => {
            if (!prev) return null;

            switch (field) {
                case "username":
                    return { ...prev, username: oldUser.username };

                case "email":
                    return { ...prev, email: oldUser.email };

                case "full_name":
                    return { ...prev, full_name: oldUser.full_name };

                case "phone":
                    return { ...prev, phone: oldUser.phone };

                case "address_line1":
                    return { ...prev, address_line1: oldUser.address_line1 };

                case "address_line2":
                    return { ...prev, address_line2: oldUser.address_line2 };

                case "city":
                    return { ...prev, city: oldUser.city };

                case "postal_code":
                    return { ...prev, postal_code: oldUser.postal_code };

                case "country":
                    return { ...prev, country: oldUser.country };

                default:
                    return oldUser;
            }
        });
    };

    const updateUser = async (): Promise<boolean | null> => {
        try {
            setLoading(true);

            if (!editUser || !oldUser) return null;

            for (const [key, value] of Object.entries(fieldErrors)) {
                if (value) {
                    showAlert("error", "There's still error(s)")
                    return null;
                }
            }

            const res = await updateUserApi(editUser);

            if (res === null) return null;

            if (!res.success) {
                showAlert("error", res.info);
                return false;
            } else {
                showAlert("success", res.info);
                return true;
            }

        } catch (err) {
            if (err instanceof Error) {
                showAlert("error", err.message);

            } else {
                showAlert("error", " Something went wrong");

            }

            return null;

        } finally {
            setLoading(false);

        }
    }

    const validateField = async (value: string, field: "username" | "email" | "phone"): Promise<boolean | null> => {
        try {
            const res = await validateFieldApi(value, field);

            if (!res) {
                showAlert("error", "Was not able to validate username");
                return null;
            }

            return res.success;

        } catch (err) {
            if (err instanceof Error) {
                showAlert("error", err.message);

            } else {
                showAlert("error", " Something went wrong");

            }

            return null;

        }
    };

    const onUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newUsername = e.target.value;

        setEditUser(prev => {
            if (!prev) return null;

            return {
                ...prev,
                username: newUsername
            };
        });
    };
    
    const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newEmail = e.target.value;

        setEditUser(prev => {
            if (!prev) return null;

            return {
                ...prev,
                email: newEmail
            };
        });
    };
    
    const onPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPhone = e.target.value;

        setEditUser(prev => {
            if (!prev) return null;

            return {
                ...prev,
                phone: newPhone
            };
        });
    };

    const onFullnameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newFullname = e.target.value;

        setEditUser(prev => {
            if (!prev) return null;

            return {
                ...prev,
                full_name: newFullname
            };
        });
    };

    const onAddressLineChange = (e: React.ChangeEvent<HTMLInputElement>, number: 1 | 2) => {
        const newAddressLine = e.target.value;

        setEditUser(prev => {
            if (!prev) return null;

            if (number === 1) {
                return {
                    ...prev,
                    address_line1: newAddressLine
                };

            } else {
                return {
                    ...prev,
                    address_line2: newAddressLine
                };

            }
        });
    };

    const onCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newCity = e.target.value;

        setEditUser(prev => {
            if (!prev) return null;

            return {
                ...prev,
                city: newCity
            };
        });
    };

    const onPostalCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPostalCode = e.target.value;

        setEditUser(prev => {
            if (!prev) return null;

            return {
                ...prev,
                postal_code: newPostalCode
            };
        });
    };

    const onCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newCountry = e.target.value;;

        setEditUser(prev => {
            if (!prev) return null;

            return {
                ...prev,
                country: newCountry
            };
        });
    }

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
    
    const onEditProfileClick = () => setEditing(!editing);

    return {
        oldUser,
        editUser,
        fieldErrors,
        editing,
        loading,
        alert,onUserChange,
        onUsernameChange,
        onEmailChange,
        onPhoneChange,
        onFullnameChange,
        onAddressLineChange,
        onCityChange,
        onPostalCodeChange,
        onCountryChange,
        onUndoButtonClick,
        updateUser,
        removeAlert,
        onEditProfileClick
    };
}