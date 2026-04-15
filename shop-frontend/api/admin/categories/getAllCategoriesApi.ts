import { apiFetch } from "../../../utils/apiFetch";
import type { GetCategoryResponse } from "../../../types/category";

export const getAllCategoriesApi = async (): Promise<GetCategoryResponse | null> => {
    try {
        const res = await apiFetch(`/categories/admin/`, { method: "GET" });

        if (!res.ok) return null;

        const json: GetCategoryResponse = await res.json();

        if (!json.success) return null;
        
        return json

    } catch (err) {
        console.log(err);
        return null;
    }
};