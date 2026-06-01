import { apiFetch } from "../../../utils/apiFetch";
import type { Response } from "../../../types/response";

export const deleteCategoryApi = async (
    id: number
): Promise<Response | null> => {
    try {
        const res = await apiFetch(`/categories/admin/${id}`, {
            method: "DELETE"
        });

        if (!res.ok) return null;

        const json: Response = await res.json();

        return json;

    } catch (err) {
        console.log(err);
        return null;
    }
};