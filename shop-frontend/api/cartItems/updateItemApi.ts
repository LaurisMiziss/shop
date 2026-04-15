import { apiFetch } from "../../utils/apiFetch";
import type { Response } from "../../types/response";

export const updateItemApi = async (
    productId: number,
    quantity: number
): Promise<Response | null> => {
    const token = localStorage.getItem("token");

    if (!token) return null;

    try {
        const res = await apiFetch(`/carts/${productId}`, {
            method: "PATCH",
            headers: ({ token }),
            body: JSON.stringify({
                quantity: quantity
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