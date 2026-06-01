import { apiFetch } from "../../utils/apiFetch";
import type { Response } from "../../types/response";

export const patchUserSettingsApi = async (
    value: "LV" | "EN" | "DARK" | "LIGHT",
    field: "language" | "theme"
): Promise<Response | null> => {
    try {

        const data = field === "language" ? {language: value} : {theme: value};

        const res = await apiFetch(`/auth/settings`, {
            method: "PATCH",
            body: JSON.stringify(data)
        });
        
        if (!res.ok) return null;

        const json: Response = await res.json();

        return json;

    } catch (err) {
        console.log(err);
        return null;
    }
};