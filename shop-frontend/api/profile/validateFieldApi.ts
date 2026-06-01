import { apiFetch } from "../../utils/apiFetch";
import type { Response } from "../../types/response";

export const validateFieldApi = async (
    value: string,
    field: "username" | "email" | "phone"
): Promise<Response | null> => {
    try {
        const res = await apiFetch(`/auth/check?field=${field}&value=${value}`, {
            method: "GET"
        });

        if (!res.ok && res.status !== 409) return null;

        const json: Response = await res.json();

        return json;

    } catch (err) {
        console.log(err);
        return null;
    }
};