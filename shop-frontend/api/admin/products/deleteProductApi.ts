import { apiFetch } from "../../../utils/apiFetch";
import type { Response } from "../../../types/response";

export const deleteProductApi = async (
    id: number
): Promise<Response | null> => {
    try {
        const res = await apiFetch(`/products/admin/${id}`, {
            method: "DELETE"
        });

        if (!res.ok && res.status !== 409) return null;

        const json: Response = await res.json();

        return json;

    } catch (err) {
        console.log(err);
        return null;
    }
};