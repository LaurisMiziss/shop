import { apiFetch } from "../../../utils/apiFetch";
import type { GetUserResponse } from "../../../types/user";

export const getUserApi = async (
    user_id: number | undefined
): Promise<GetUserResponse | null> => {
    try {
        const res = await apiFetch(`/auth/admin/${user_id}`, { method: "GET" });
        
        if (!res.ok) return null;

        const json: GetUserResponse = await res.json();

        if (!json.success) return null;
        
        return json

    } catch (err) {
        console.log(err);
        return null;
    }
};