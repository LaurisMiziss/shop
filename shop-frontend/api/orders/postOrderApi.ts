import type { OrderCreation } from "../../types/order"
import type { ResponseWithData } from "../../types/response";
import { apiFetch } from "../../utils/apiFetch";

export const postOrderApi = async (orderInfo: OrderCreation): Promise<ResponseWithData | null> => {
    const token = localStorage.getItem("token");

    if (!token) return null;

    try {
        const res = await apiFetch(`/orders/`, {
            method: "POST",
            headers: { token },
            body: JSON.stringify(orderInfo)
        });

        if (!res.ok) return null;

        const json: ResponseWithData = await res.json();

        return json;

    } catch (err) {
        console.log(err);
        return null;
    }
};