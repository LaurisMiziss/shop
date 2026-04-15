import "./OrderListTable.css";
import type { Order } from "../../types/order";

interface OrderListTableProps {
    orders: Order[] | null;
    selected: {orderId: number, note: string | null} | null;
    alert: {type: "success" | "error", message: string} | null;
    onNoteChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    handleEditChange: (orderId: number) => void;
    onSaveOrUndo: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
    onNavigateToProductDetails: (productId: number) => void;
    onDeleteOrder: (orderId: number) => void;
    removeAlert: () => void;
}

export function OrderListTable({ 
    orders,
    selected,
    alert,
    handleEditChange,
    onNoteChange,
    onSaveOrUndo,
    onNavigateToProductDetails,
    onDeleteOrder,
    removeAlert
}: OrderListTableProps) {

  if (!orders) {
      return (
          <div>
              <h3>Orders</h3>
              <p>Your order list is empty</p>
          </div>
      );
  }

  return (
    <div className="orders-container">

        {/* ALERT */}
        <div className="alert-container" onMouseEnter={removeAlert}>
            {alert && (
                <div className={`alert ${alert.type}`}>
                    {alert.message}
                </div>
            )}
        </div>

        <h3 className="orders-title">Orders</h3>

        <div className="orders-list">
            {orders.map(order => (
                <div key={order.id} className="order-card">

                    {/* HEADER */}
                    <div className="order-header">
                        <div>
                            <strong>Order #{order.id}</strong>
                            <p className="order-date">{order.created_at}</p>
                        </div>

                        <div className={`order-status ${order.status}`}>
                            {order.status}
                        </div>
                    </div>

                    {/* ITEMS */}
                    <div className="order-items">
                        {order.items.map(item => (
                            <div key={item.product_id} className="order-item-row">

                                <div
                                    className="order-item-name"
                                    onClick={() => onNavigateToProductDetails(item.product_id)}
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
                    </div>

                    {/* NOTES */}
                    <div className="order-notes">
                        <div className="notes-header">
                            <label>Notes</label>

                            {order.status !== "delivered" && (
                                <button
                                    type="button"
                                    onClick={() => handleEditChange(order.id)}
                                >
                                    Edit
                                </button>
                            )}
                        </div>

                        {selected && order.id === selected.orderId ? (
                            <div>
                                <textarea
                                    value={selected.note || ""}
                                    onChange={onNoteChange}
                                    onKeyDown={onSaveOrUndo}
                                    placeholder="Delivery instructions..."
                                />
                                
                                <p className="notes-text">
                                    Press Ctrl to save or Escape button to undo changes
                                </p>
                            </div>
                        ) : (
                            <p className="notes-text">
                                {order.customer_notes || "No notes"}
                            </p>
                        )}
                    </div>

                    {/* FOOTER */}
                    <div className="order-footer">
                        <strong>€{order.total_amount}</strong>

                        {(order.status === "delivered" || order.status === "cancelled") && (
                            <button
                                className="delete-button"
                                onClick={() => onDeleteOrder(order.id)}
                            >
                                Delete
                            </button>
                        )}
                    </div>

                </div>
            ))}
        </div>
    </div>
  );
}