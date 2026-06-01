import { apiFetch } from "../../../utils/apiFetch";
import type { Response } from "../../../types/response";
import type { Category } from "../../../types/category";

export const postCategoryApi = async (
    category: Category
): Promise<Response | null> => {
    try {
        const res = await apiFetch(`/categories/admin/`, {
            method: "POST",
            body: JSON.stringify({
                name: category.name,
                description: category.description,
                image_url: category.image_url,
                display_order: category.display_order,
                is_active: category.is_active,
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