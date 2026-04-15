import { apiFetch } from "../../utils/apiFetch";
import type { Response } from "../../types/response";
import type { Cart } from "../../types/cart";

export const deleteCartItemsApi = async (
    cart: Cart[]
): Promise<Response | null> => {
    const token = localStorage.getItem("token");

    if (!token) return null;

    try {
        const params = new URLSearchParams();

        cart.forEach(item => {
            params.append("cart_items", item.product_id.toString());
        });

        const res = await apiFetch(`/carts/delete?${params.toString()}`, {
            method: "DELETE",
            headers: { token }
        });

        if (!res.ok) return null;

        const json: Response = await res.json();

        return json;

    } catch (err) {
        console.log(err);
        return null;
    }
};