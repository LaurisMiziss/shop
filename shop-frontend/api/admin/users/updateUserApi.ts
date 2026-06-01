import { apiFetch } from "../../../utils/apiFetch";
import type { Response } from "../../../types/response";

export const updateUserApi= async (
    userId: number,
    userRole: "customer" | "admin"
): Promise<Response | null> => {
    try {
        const res = await apiFetch(`/auth/admin/${userId}`, {
            method: "PATCH",
            body: JSON.stringify({
                role: userRole
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