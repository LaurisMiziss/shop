import { apiFetch } from "../../../utils/apiFetch";
import type { Response } from "../../../types/response";
import type { Order } from "../../../types/order";

export const updateOrderApi = async (
    order: Order
): Promise<Response | null> => {
    try {
        const res = await apiFetch(`/orders/admin/${order.id}`, {
            method: "PATCH",
            body: JSON.stringify({
                admin_notes: order.admin_notes,
                status: order.status,
                payment_status: order.payment_status
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