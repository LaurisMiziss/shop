import { apiFetch } from "../../utils/apiFetch";
import type { Response } from "../../types/response";

export const changePasswordApi = async (
    oldPassword: string,
    newPassword: string
): Promise<Response | null> => {
    try {
        const res = await apiFetch(`/auth/change-password`, {
            method: "PATCH",
            body: JSON.stringify({ 
                oldPassword: oldPassword,
                newPassword: newPassword
            })
        });

        if (!res.ok) return null;

        const json: Response = await res.json();

        return json;

    } catch (err) {
        console.log(err);
        return null;
    }
};