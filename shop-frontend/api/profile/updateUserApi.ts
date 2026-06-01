import { apiFetch } from "../../utils/apiFetch";
import type { Response } from "../../types/response";
import type { User } from "../../types/user";

export const updateUserApi = async (
    user: User
): Promise<Response | null> => {
    try {
        const res = await apiFetch(`/auth/`, {
            method: "PATCH",
            body: JSON.stringify(user)
        });

        if ((!res.ok && res.status !== 409) || (!res.ok && res.status !== 400)) return null;

        const json: Response = await res.json();

        return json;

    } catch (err) {
        console.log(err);
        return null;
    }
};