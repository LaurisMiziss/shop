import { apiFetch } from "../../utils/apiFetch";
import type { GetProductDetailResponse, ProductDetail } from "../../types/products";

export const getProductDetailsApi = async (
    productId: number
): Promise<ProductDetail | null> => {
    try {
        const res = await apiFetch(`/products/${productId}`, { method: "GET" });

        if (!res.ok && res.status !== 404) return null;

        const json: GetProductDetailResponse = await res.json();
        
        return json.data;

    } catch (err) {
        console.log(err);
        return null;
    }
};