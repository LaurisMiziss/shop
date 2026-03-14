import { useState, useEffect } from "react";
import { onRegisterApi } from "../../api/auth/onRegisterApi";
import { validateRegisterFields } from "../../api/auth/validateRegisterFields";
import { validateEmailFormat } from "../../utils/validateEmailFormat";
import { validatePasswordFormat } from "../../utils/validatePasswordFormat";
import { validatePhoneFormat } from "../../utils/validatePhoneFormat";
import type { Response } from "../../types/response";
import type { FieldErrors } from "../../types/fieldErrors";
import { EUROPEAN_COUNTRIES } from "../../data/countries";

export function useRegisterForm() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullname, setFullname] = useState("");
    const [phone, setPhone] = useState("");
    const [phonePrefix, setPhonePrefix] = useState("");
    const [addressLine1, setAddressLine1] = useState("");
    const [addressLine2, setAddressLine2] = useState("");
    const [country, setCountry] = useState("");
    const [city, setCity] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({
        username: "",
        email: "",
        password: "",
        phone: "",
    });

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const password = e.target.value;

        setPassword(password);

        if (password.length > 4 && !validatePasswordFormat(password)) {
            setFieldErrors(prev => ({...prev, password: "Password must contain one upper case letter, one number and be 8 symbols long."}));
        } else {
            setFieldErrors(prev => ({...prev, password: ""}));
        }
    };

    const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const code = e.target.value;
        setCountry(code);
        
        const found = EUROPEAN_COUNTRIES.find(c => c.code === code);
        setPhonePrefix(found?.prefix ?? "");
    };

    useEffect(() => {
        if (username.length > 5) {
            const timeout = setTimeout(async () => {
                try {
                    const res = await validateRegisterFields(username, undefined, undefined)
                    console.log(res)
                    if (res?.success === false) {
                        setFieldErrors(prev => ({...prev, username: res.info ?? res.info}));
                    } else {
                        setFieldErrors(prev => ({...prev, username: ""}));
                    }
                } catch (err) {
                    if (err instanceof Error) {
                        setError(err.message);
                    } else {
                        setError("Something went wrong");
                    }
                }
            }, 1000);

            return () => clearTimeout(timeout);
        }

    }, [username]);

    useEffect(() => {
        if (email.length > 7) {
            const emailTimeout = setTimeout(async () => {
                const res = validateEmailFormat(email);

                if (!res) {
                    return setFieldErrors(prev => ({...prev, email: "Invalid e-mail format"}));
                } else {
                    setFieldErrors(prev => ({...prev, email: ""}));

                    try {
                        const res = await validateRegisterFields(undefined, email, undefined)

                        if (res?.success === false) {
                            setFieldErrors(prev => ({...prev, email: res.info ?? res.info}));
                        } else {
                            setFieldErrors(prev => ({...prev, email: ""}));
                        }
                    } catch (err) {
                        if (err instanceof Error) {
                            setError(err.message);
                        } else {
                            setError("Something went wrong");
                        }
                    }
                }
            }, 750);
            
            return () => clearTimeout(emailTimeout);
        }
    }, [email]);

    useEffect(() => {
        if (!phone || !phonePrefix) return;

        const fullNumber = `${phonePrefix}${phone}`;
        const error = validatePhoneFormat(fullNumber);
        setFieldErrors(prev => ({ ...prev, phone: error ?? "" }));

        const timeout = setTimeout(async () => {
            try {
                const res = await validateRegisterFields(undefined, undefined, fullNumber);

                if (res?.success === false) {
                    setFieldErrors(prev => ({...prev, phone: res.info ?? res.info}));
                }
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("Something went wrong");
                }
            }
        }, 500)
        
        return () => clearTimeout(timeout);
    }, [phone]);


    const handleRegister = async (): Promise<Response | null> => {
        setLoading(true);
        setError(null);

        try {
            const res = await onRegisterApi(username, email, password, fullname, `${phonePrefix}${phone}`, addressLine1, addressLine2, country, city, postalCode);

            if (!res?.success) setError(res?.info ?? "Something went wrong");

            if (res?.success === false) {
                setFieldErrors(prev => ({...prev, username: res.info ?? res.info}));
            } else {
                setFieldErrors(prev => ({...prev, username: ""}));
            }

            return res;

        } catch (err) {
            console.log(err);
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Something went wrong");
            }
            return null;

        } finally {
            setLoading(false);
        }
    };

    return {
        username,
        email,
        password,
        fullname,
        phone,
        phonePrefix,
        addressLine1,
        addressLine2,
        country,
        city,
        postalCode,
        showPassword,
        loading,
        error,
        fieldErrors,
        setUsername,
        setEmail,
        setFullname,
        setPhone,
        setAddressLine1,
        setAddressLine2,
        setCity,
        setPostalCode,
        togglePassword: () => setShowPassword(prev => !prev),
        handlePasswordChange,
        handleCountryChange,
        handleRegister,
    };
}