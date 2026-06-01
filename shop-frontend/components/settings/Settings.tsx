import "./Settings.css";
import { Alert } from "../general/alert/Alert";
import { translations } from "../../data/languages";

interface SettingsProps {
    theme: "LIGHT" | "DARK";
    language: "EN" | "LV";
    alert: {type: "success" | "error", message: string} | null;
    onThemeChange: (theme: "LIGHT" | "DARK") => void;
    onLanguageChange: (lang: "EN" | "LV") => void;
    removeAlert: () => void;
}

export function Settings({ theme, language, alert, onThemeChange, onLanguageChange, removeAlert}: SettingsProps) {

    const t = translations[language ? language : "EN"];

    return (
        <div className="settings-container" data-theme={theme}>

            {/* ALERT */}
            <Alert alert={alert} onRemoveAlert={removeAlert} />

            <h2 className="settings-title">{t.settingsTitle}</h2>
            <h3 className="settings-under-title">{t.settingsExplanation}</h3>

            {/* THEME */}
            <div className="settings-item">
                <div>
                    <p className="settings-label">{t.theme}</p>
                    <p className="settings-value">{t.themeValues[theme]}</p>
                </div>

                <button
                    className={`switch ${theme === "DARK" ? "active" : ""}`}
                    onClick={() =>
                        onThemeChange(theme === "LIGHT" ? "DARK" : "LIGHT")
                    }
                >
                    <span className="switch-thumb" />
                </button>
            </div>

            {/* LANGUAGE */}
            <div className="settings-item">
                <div>
                    <p className="settings-label">{t.language}</p>
                    <p className="settings-value">{language}</p>
                </div>

                <button
                    className={`switch ${language === "LV" ? "active" : ""}`}
                    onClick={() =>
                        onLanguageChange(language === "LV" ? "EN" : "LV")
                    }
                >
                    <span className="switch-thumb" />
                </button>
            </div>

        </div>
    );
}