import { apiFetch } from "../../utils/apiFetch";
import type { GetProductsResponse, Product } from "../../types/products";

export const getAdminProductsWithFiltersApi = async (
    name: string | undefined,
    categoryId: number | undefined,
    sort: string | undefined,
    sortType: string | undefined,
    priceMin: number | undefined,
    priceMax: number | undefined,
    isFeatured: string | undefined,
    limit: number | undefined,
    offset: number | undefined,
): Promise<Product[] | null> => {
    try {
        const params = new URLSearchParams({
            name:       name      ?? "",
            sort:       sort      ?? "name",
            sort_type:  sortType  ?? "DESC",
            price_min:  String(priceMin ?? 0),
            price_max:  String(priceMax ?? 10000),
            is_featured: isFeatured ?? "",
            limit:      String(limit  ?? 10),
            offset:     String(offset ?? 0),
        });
        
        if (categoryId) params.append("category_id", String(categoryId));

        const endpoint = `/products/admin?${params.toString()}`;

        const res = await apiFetch(endpoint, { method: "GET" });

        if (!res.ok) return null;
        
        const json: GetProductsResponse = await res.json();

        if (!json.success) return null;

        return json.data;

    } catch (err) {
        console.error(err);
        return null;
    }
};