import { apiFetch } from "../../../utils/apiFetch";
import type { Response } from "../../../types/response";
import type { ProductDetail } from "../../../types/products";

export const updateProductApi = async (
    product: ProductDetail
): Promise<Response | null> => {
    try {
        const res = await apiFetch(`/products/admin/${product.id}`, {
            method: "PATCH",
            body: JSON.stringify({
                id: product.id,
                category_id: +product.category_id,
                description: product.description,
                created_at: product.created_at,
                updated_at: product.updated_at,
                image_url: product.image_url,
                images: product.images,
                is_active: product.is_active,
                is_featured: product.is_featured,
                name: product.name,
                price: +product.price,
                sku: product.sku,
                stock: +product.stock,
                unit: product.unit,
                weight: +product.weight
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