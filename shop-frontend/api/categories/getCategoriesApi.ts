import { apiFetch } from "../../utils/apiFetch";
import type { GetCategoryResponse, Category } from "../../types/category";

export const getCategoriesApi = async (): Promise<Category[] | null> => {
    try {
        const res = await apiFetch(`/categories/`, { method: "GET" });

        if (!res.ok) return null;

        const json: GetCategoryResponse = await res.json();

        if (!json.success) return null;

        return json.data;

    } catch (err) {
        console.error(err);
        return null;
    }
};