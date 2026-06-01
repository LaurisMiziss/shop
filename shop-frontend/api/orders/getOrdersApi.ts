import { apiFetch } from "../../utils/apiFetch";
import type { Order, GetOrderResponse } from "../../types/order";

export const getOrdersApi = async (filters: {limit: number, offset: number}): Promise<Order[] | null> => {
    const token = localStorage.getItem("token");

    if (!token) return null;

    try {
        const res = await apiFetch(`/orders?limit=${filters.limit}&offset=${filters.offset}`, { headers: { token }, method: "GET" });

        if (!res.ok) return null;

        const json: GetOrderResponse = await res.json();

        if (!json.success) return null;
        
        return json.data;

    } catch (err) {
        console.log(err);
        return null;
    }
};