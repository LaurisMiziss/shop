import { apiFetch } from "../../../utils/apiFetch";
import type { GetUsersResponse } from "../../../types/user";

export const getUsersApi = async (
    limit: number,
    offset: number,
    user_id: number | undefined
): Promise<GetUsersResponse | null> => {
    try {
        const params = new URLSearchParams({
            limit:           String(limit)      ?? 10,
            offset:          String(offset)     ?? 0,
            user_id:        String(user_id)   ?? "",
        });

        const endpoint = `/auth/admin?${params.toString()}`;

        const res = await apiFetch(`${endpoint}`, { method: "GET" });
        
        if (!res.ok) return null;

        const json: GetUsersResponse = await res.json();

        if (!json.success) return null;
        
        return json

    } catch (err) {
        console.log(err);
        return null;
    }
};