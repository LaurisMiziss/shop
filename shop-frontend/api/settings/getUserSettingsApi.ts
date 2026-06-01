import { apiFetch } from "../../utils/apiFetch";
import type { SettingsResponse } from "../../types/response";

export const getUserSettingsApi = async (): Promise<SettingsResponse | null> => {
    try {
        const res = await apiFetch(`/auth/get-settings`, {
            method: "GET"
        });

        if (!res.ok) return null;

        const json: SettingsResponse = await res.json();

        return json;

    } catch (err) {
        console.log(err);
        return null;
    }
};