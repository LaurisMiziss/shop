import { useState, useRef } from "react";
import type { Order } from "../../../types/order";
import { updateOrderApi } from "../../../api/admin/orders/updateOrderApi";

export function useOrderDetails() {
    const [oldOrder, setOldOrder] = useState<Order | null>(null);
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState<{type: "success" | "error", message: string} | null>(null);

    const alertRef = useRef<number | null>(null);
    
    const handleOrderChange = (order: Order | null) => {
        if (!order) return showAlert("error", "Order can't be null");

        setOldOrder(order);
        setOrder(order);
    };

    const onUpdateOrderClick = async (e: React.FormEvent) => {
        try {
            e.preventDefault();
            if (!order) return;

            setLoading(true);

            const res = await updateOrderApi(order);

            if (!res) return showAlert("error", "Something went wrong");

            showAlert("success", "Order was successfully updated");

        } catch (err) {
            if (err instanceof Error) {
                showAlert("error", err.message);
            } else {
                showAlert("error", "Something went wrong");
            }

        } finally {
            setLoading(false);

        }
    };

    const onUndoClick = (field: "notes" | "order_status" | "payment_status" | undefined) => {
        if (!oldOrder) return;

        const doChanges = confirm(`Are you want to undo changes for field ${field}?`);
        if (!doChanges) return;

        setOrder(prev => {
            if (!prev) return null;

            switch (field) {
                case "notes":
                    return { ...prev, admin_notes: oldOrder.admin_notes };

                case "order_status":
                    return { ...prev, status: oldOrder.status };
                
                case "payment_status":
                    return { ...prev, payment_status: oldOrder.payment_status };

                default:
                    return oldOrder
            };
        });
    };

    const onNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newNotes = e.target.value;

        setOrder(prev => {
            if (!prev) return null;
            return {
                ...prev,
                admin_notes: newNotes
            };
        });
    };

    const onOrderStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value;

        const allowedStatus = ["pending", "processing", "shipped", "delivered", "cancelled"];

        if (!allowedStatus.includes(newStatus)) return showAlert("error", "Invalid status");

        setOrder(prev => {
            if (!prev) return null;
            return {
                ...prev,
                status: newStatus
            };
        });
    };

    const onPaymentStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value;

        const allowedStatus = ["pending", "paid", "failed"];

        if (!allowedStatus.includes(newStatus)) return showAlert("error", "Invalid status");

        setOrder(prev => {
            if (!prev) return null;
            return {
                ...prev,
                payment_status: newStatus
            };
        });
    };

    const showAlert = (type: "success" | "error", message: string) => {
        setAlert({type: type, message: message});

        if (alertRef.current) {
            clearTimeout(alertRef.current);
        }

        alertRef.current = setTimeout(() => {
            setAlert(null);
        }, 5000);
    };

    const removeAlert = () => setAlert(null);

    return {
        oldOrder,
        order,
        loading,
        alert,
        handleOrderChange,
        onUndoClick,
        onUpdateOrderClick,
        onNotesChange,
        onOrderStatusChange,
        onPaymentStatusChange,
        showAlert,
        removeAlert
    };
}