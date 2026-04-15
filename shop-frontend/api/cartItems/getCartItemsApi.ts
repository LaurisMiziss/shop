import { apiFetch } from "../../utils/apiFetch";
import type { Cart } from "../../types/cart";

export const getCartItemsApi = async (
    name: string | undefined,
    categoryId: number | undefined,
    sort: string | undefined,
    sortType: string | undefined,
    priceMin: number | undefined,
    priceMax: number | undefined,
    isFeatured: string | undefined,
    limit: number | undefined,
    offset: number | undefined,
): Promise<Cart[] | null> => {
    const token = localStorage.getItem("token");

    if (!token) return null;

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

        const endpoint = `/carts?${params.toString()}`;

        const res = await apiFetch(endpoint, {
            method: "GET",
            headers: ({ token }),
        });
        
        if (!res.ok) return null;

        const json = await res.json();

        const cart: Cart[] = json.data;

        return cart;

    } catch (err) {
        console.log(err);
        return null;
    }
};