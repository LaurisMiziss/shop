import "../general/ComponentDetails.css";
import type { Order } from "../../../types/order"
import { Alert } from "../../general/alert/Alert";

interface OrderDetailsProps {
    oldOrder: Order | null;
    order: Order | null;
    loading: boolean;
    alert: {type: "success" | "error", message: string} | null;
    onUndoClick: (field: "notes" | "order_status" | "payment_status" | undefined) => void;
    onUpdateOrderClick: (e: React.FormEvent) => void;
    onNotesChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onOrderStatusChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onPaymentStatusChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    removeAlert: () => void;
    onNavigateToProductDetails: (productId: number, action: "update") => void;
}

export function OrderDetails({
    oldOrder,
    order,
    loading,
    alert,
    onUndoClick,
    onUpdateOrderClick,
    onNotesChange,
    onOrderStatusChange,
    onPaymentStatusChange,
    removeAlert,
    onNavigateToProductDetails
}: OrderDetailsProps) {

    if (!order || !oldOrder) {
        return (
            <div className="centred-content">
                <p>
                    Error 404
                    <br />
                    Order is not found
                </p>
            </div>
        );
    }

    const undoButton = (field: "notes" | "order_status" | "payment_status" | undefined) => {
        return (
            <button type="button" onClick={() => onUndoClick(field)} disabled={loading} className="action-btn">
                Undo Changes
            </button>
        );
    };

    return (
        <div className="page">

            {/* ALERT */}
            <Alert alert={alert} onRemoveAlert={removeAlert} />

            <h2 className="page-title">
                {`Editing order with ID: ${oldOrder.id}`}
            </h2>

            <form onSubmit={onUpdateOrderClick}>

                {/* ORDER ID */}
                <section className="form-section">
                    <div className="form-group">
                        <label htmlFor="order-id">Order ID:</label>
                        <input
                            type="text"
                            id="order-id"
                            placeholder="344"
                            required
                            minLength={1}
                            value={order.id}
                            disabled={true}
                        />
                    </div>
                </section>

                {/* USER ID */}
                <section className="form-section">
                    <div className="form-group">
                        <label htmlFor="order-user-id">User ID:</label>
                        <input
                            type="text"
                            id="order-user-id"
                            placeholder="64"
                            required
                            minLength={1}
                            value={order.user_id}
                            disabled={true}
                        />
                    </div>
                </section>

                {/* ORDER STATUS */}
                <section className="form-section">
                    <div className="form-group">
                        <label htmlFor="order-status">Order status:</label>
                        <select id="order-status" value={order.status} onChange={onOrderStatusChange}>
                            <option value="pending">
                                Pending
                            </option>
                            <option value="processing">
                                Processing
                            </option>
                            <option value="shipped">
                                Shipped
                            </option>
                            <option value="delivered">
                                Delivered

                            </option>
                            <option value="cancelled">
                                Cancelled
                            </option>
                        </select>
                        {undoButton("order_status")}
                    </div>
                </section>

                {/* PAYMENT STATUS */}
                <section className="form-section">
                    <div className="form-group">
                        <label htmlFor="order-payment-status">Order payment status:</label>
                        <select id="order-payment-status" value={order.payment_status} onChange={onPaymentStatusChange}>
                            <option value="pending">
                                Pending
                            </option>
                            <option value="paid">
                                Paid
                            </option>
                            <option value="failed">
                                Failed
                            </option>
                        </select>
                        {undoButton("payment_status")}
                    </div>
                </section>

                {/* CUSTOMER NOTES */}
                <section className="form-section">
                    <div className="form-group">
                        <label htmlFor="order-customer-notes">Customer notes:</label>
                        <input
                            id="order-customer-notes"
                            type="text"
                            value={order.customer_notes ? order.customer_notes : "Notes are empty"}
                            disabled={true}
                        />
                    </div>
                </section>

                {/* ADMIN NOTES */}
                <section className="form-section">
                    <div className="form-group">
                        <label htmlFor="order-admin-notes">Admin notes:</label>
                        <textarea
                            id="order-admin-notes"
                            value={order.admin_notes ? order.admin_notes : ""}
                            onChange={onNotesChange}
                        />
                        {undoButton("notes")}
                    </div>
                </section>

                {/* ITEMS */}
                <section className="form-section">
                    <div className="form-group">
                        <label htmlFor="order-items">Items:</label>
                        {order.items.map(item => (
                            <div key={item.product_id} className="order-item-row">

                                <div
                                    className="order-item-name"
                                    onClick={() => onNavigateToProductDetails(item.product_id, "update")}
                                >
                                    {item.product_name}
                                </div>

                                <div className="order-item-meta">
                                    €{item.product_price} × {item.quantity}
                                </div>

                                <div className="order-item-subtotal">
                                    €{item.subtotal}
                                </div>

                            </div>
                        ))}
                        <div>
                            <label htmlFor="order-total">Total amount:</label>
                            <p>
                                €{order.total_amount}
                            </p>
                        </div>
                    </div>
                </section>

                 <div className="form-group">
                    <div className="button-group">
                        <button type="submit" disabled={loading} className="action-btn">
                            Save Changes
                        </button>
                        <button type="button" onClick={() => onUndoClick(undefined)} disabled={loading} className="action-btn">
                            Undo Changes
                        </button>
                    </div>
                </div>

            </form>
        </div>
    );
}