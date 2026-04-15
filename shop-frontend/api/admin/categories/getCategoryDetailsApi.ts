import { apiFetch } from "../../../utils/apiFetch";
import type { GetCategoryDetailsResponse } from "../../../types/category";

export const getCategoryDetailsApi = async (categoryId: number): Promise<GetCategoryDetailsResponse | null> => {
    try {
        const res = await apiFetch(`/categories/admin/${categoryId}`, { method: "GET" });

        if (!res.ok) return null;

        const json: GetCategoryDetailsResponse = await res.json();

        if (!json.success) return null;
        
        return json;

    } catch (err) {
        console.log(err);
        return null;
    }
};