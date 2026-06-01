import { apiFetch } from "../../../utils/apiFetch";
import type { Response } from "../../../types/response";

export const checkForDuplicatesApi = async (parameters: {
    name: string | undefined,
    display_order: number | undefined,
    category_id: number | undefined
}): Promise<Response | null> => {
    try {
        const params = new URLSearchParams({
            name:           parameters.name      ?? "",
            display_order:  String(parameters.display_order), 
            category_id:    String(parameters.category_id),
        });

        const endpoint = `/categories/admin/check?${params.toString()}`;

        const res = await apiFetch(`${endpoint}`, {
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