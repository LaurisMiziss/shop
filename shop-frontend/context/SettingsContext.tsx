import { createContext, useContext, useRef, useState, useEffect } from "react";
import { getUserSettingsApi } from "../api/settings/getUserSettingsApi";
import { patchUserSettingsApi } from "../api/settings/patchUserSettingsApi";

interface SettingsContextType {
    theme: "LIGHT" | "DARK";
    language: "EN" | "LV";
    alert: {type: "success" | "error", message: string} | null;
    getUserSettings: () => void;
    onThemeChange: (theme: "LIGHT" | "DARK") => void;
    onLanguageChange: (lang: "EN" | "LV") => void;
    showAlert: (type: "success" | "error", message: string) => void;
    removeAlert: () => void;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

export function SettingsProvider({ children }: {children: React.ReactNode }) {
    const [theme, setTheme] = useState<"LIGHT" | "DARK">("LIGHT");
    const [language, setLanguage] = useState<"EN" | "LV">("EN");
    const [alert, setAlert] = useState<{type: "success" | "error", message: string} | null>(null);

    const alertRef = useRef<number | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            await getUserSettings();
        }

        fetchData();
    }, []);

    useEffect(() => {
        console.log(theme, language)
    }, [language, theme])

    const getUserSettings = async () => {
        try {

            const res = await getUserSettingsApi();

            if (!res || !res.data) return showAlert("error", "Something went wrong");

            setTheme(res.data[0].theme);

            setLanguage(res.data[0].language);

        } catch (err) {
            if (err instanceof Error) {
                showAlert("error", err.message);

            } else {
                showAlert("error", "Something went wrong");

            }

        }
    };

    const onLanguageChange = async (newLanguage: "LV" | "EN") => {
        try {
            const prev = language;

            setLanguage(newLanguage);

            const allowedOptions = ["LV", "EN"];

            if (newLanguage === prev || (!allowedOptions.includes(newLanguage))) return;

            const res = await patchUserSettingsApi(newLanguage, "language");

            if (!res) {
                setLanguage(prev);
                return showAlert("error", "Something went wrong");
            }

        } catch (err) {
            if (err instanceof Error) {
                showAlert("error", err.message);

            } else {
                showAlert("error", "Something went wrong");

            }

        }
    };

    const onThemeChange = async (newTheme: "DARK" | "LIGHT") => {
        try {
            const prev = theme;

            setTheme(newTheme);

            const allowedOptions = ["DARK", "LIGHT"];

            if (newTheme === prev || (!allowedOptions.includes(newTheme))) return;

            const res = await patchUserSettingsApi(newTheme, "theme");

            if (!res) {
                setTheme(prev);
                return showAlert("error", "Something went wrong");
            }

        } catch (err) {
            if (err instanceof Error) {
                showAlert("error", err.message);

            } else {
                showAlert("error", "Something went wrong");

            }

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

    return (
        <SettingsContext.Provider value={{
            theme,
            language,
            alert,
            onThemeChange,
            onLanguageChange,
            getUserSettings,
            showAlert,
            removeAlert
        }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const ctx = useContext(SettingsContext);

    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");

    return ctx;
}