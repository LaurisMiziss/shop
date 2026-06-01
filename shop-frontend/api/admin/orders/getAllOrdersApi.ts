import { apiFetch } from "../../../utils/apiFetch";
import type { GetOrderResponse } from "../../../types/order";

export const getAllOrdersApi = async (
    limit: number,
    offset: number,
    order_id: number | undefined
): Promise<GetOrderResponse | null> => {
    try {
        const params = new URLSearchParams({
            limit:           String(limit)      ?? 10,
            offset:          String(offset)     ?? 0,
            order_id:        String(order_id)   ?? "",
        });

        const endpoint = `/orders/admin?${params.toString()}`;

        const res = await apiFetch(`${endpoint}`, { method: "GET" });
        
        if (!res.ok) return null;

        const json: GetOrderResponse = await res.json();

        if (!json.success) return null;
        
        return json

    } catch (err) {
        console.log(err);
        return null;
    }
};