import { apiFetch } from "../../utils/apiFetch";
import type { Response } from "../../types/response";

export const postItemApi = async (
    productId: number,
    quantity: number,
    unit: string
): Promise<Response | null> => {
    const token = localStorage.getItem("token");

    if (!token) return null;

    try {
        const res = await apiFetch(`/carts/${productId}`, {
            method: "POST",
            headers: ({ token }),
            body: JSON.stringify({
                quantity: quantity,
                unit: unit
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