import { apiFetch } from "../../utils/apiFetch";
import type { Response } from "../../types/response";

export const deleteOrderApi = async (
    orderId: number
): Promise<Response | null> => {
    const token = localStorage.getItem("token");

    if (!token) return null;

    try {
        const res = await apiFetch(`/orders/${orderId}`, {
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