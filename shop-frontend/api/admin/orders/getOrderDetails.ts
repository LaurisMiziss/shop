import { apiFetch } from "../../../utils/apiFetch";
import type { GetOrderResponse } from "../../../types/order";

export const getOrderDetailsApi = async (order_id: number): Promise<GetOrderResponse | null> => {
    try {
        const res = await apiFetch(`/orders/admin/${order_id}`, { method: "GET" });
        
        if (!res.ok) return null;

        const json: GetOrderResponse = await res.json();

        if (!json.success) return null;
        
        return json

    } catch (err) {
        console.log(err);
        return null;
    }
};