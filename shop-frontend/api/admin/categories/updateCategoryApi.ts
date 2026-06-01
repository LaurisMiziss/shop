import { apiFetch } from "../../../utils/apiFetch";
import type { Response } from "../../../types/response";
import type { Category } from "../../../types/category";

export const updateCategoryApi = async (
    category: Category
): Promise<Response | null> => {
    try {
        const res = await apiFetch(`/categories/admin/${category.id.toString()}`, {
            method: "PATCH",
            body: JSON.stringify({
                id: category.id,
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