import { apiFetch } from "../../utils/apiFetch";
import type { Response } from "../../types/response";

export const deleteProfileApi = async (
    password: string
): Promise<Response | null> => {
    try {
        const res = await apiFetch(`/auth/`, {
            method: "DELETE",
            body: JSON.stringify({ password })
        });

        if (!res.ok) return null;

        const json: Response = await res.json();
        
        return json;

    } catch (err) {
        console.log(err);
        return null;
    }
};