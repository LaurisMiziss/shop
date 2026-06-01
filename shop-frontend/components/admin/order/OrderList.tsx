import "../general/ComponentList.css";
import type { Order } from "../../../types/order";
import { Alert } from "../../general/alert/Alert";
import { ViewButtonGroup } from "../../general/viewButtonGroup/ViewButtonGroup";
import { QueryBox } from "../general/QueryBox";
import { Spinner } from "../../general/spinner/Spinner";

interface OrderListProps {
    orders: Order[] | null;
    alert: {type: "success" | "error", message: string} | null;
    loading: boolean;
    view: "grid" | "table";
    query: string;
    onQueryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onViewChange: (view: "grid" | "table") => void;
    onOrderClick: (orderId: number, action: "update" | "create") => void;
    removeAlert: () => void;
}

export function OrderList({
    orders,
    alert,
    loading,
    view,
    query,
    onQueryChange,
    onViewChange,
    onOrderClick,
    removeAlert
}: OrderListProps) {

    if (!orders) {
        return (
            <div className="centred-content">
                <p>
                    Error 404
                    <br />
                    Orders are not found
                </p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="centred-content">
                <Spinner size={32} />
            </div>
        );
    }

    return (
        <div className="container">

            {/* ALERT */}
            <Alert alert={alert} onRemoveAlert={removeAlert} />

            <div className="head-container">
                
                <ViewButtonGroup view={view} onViewChange={onViewChange} />

                <QueryBox
                    query={query}
                    keyWord={"Order"}
                    onQueryChange={onQueryChange}
                />

            </div>

            {view === "table" ? (
                <div className="table-container">

                    {/* ORDERS TABLE VIEW */}

                    <table className="table">

                        <thead>

                            <tr>
                                <th>ID</th>
                                <th>User ID</th>
                                <th>Status</th>
                                <th>Total amount</th>
                                <th>Created at</th>
                            </tr>

                        </thead>

                        <tbody>
                            {orders.map(order => {
                                return (
                                    <tr
                                        key={order.id}
                                        onClick={() => onOrderClick(order.id, "update")}
                                        className="table-row"
                                    >

                                        <td className="table-cell">
                                            {order.id}
                                        </td>

                                        <td className="table-cell">
                                            {order.user_id}
                                        </td>

                                        <td className="table-cell">
                                            {order.status}
                                        </td>

                                        <td className="table-cell">
                                            €{order.total_amount}
                                        </td>

                                        <td className="table-cell">
                                            {order.created_at ? new Date(order.created_at).toLocaleString() : "null"}
                                        </td>

                                    </tr>
                                );

                            })}
                            
                        </tbody>

                    </table>

                </div>
            ) : (
                <div className="grid-container">

                    {/* ORDER GRID VIEW */}

                    {orders.map(order => (
                        <div
                            key={order.id}
                            className="card"
                            onClick={() => onOrderClick(order.id, "update")}
                        >

                            <p className="card-row">
                                <strong>ID:</strong> {order.id}
                            </p>

                            <p className="card-row">
                                <strong>User ID:</strong> {order.user_id}
                            </p>

                            <p className="card-row">
                                <strong>Status:</strong> {order.status}
                            </p>

                            <p className="card-row">
                                <strong>Total Amount:</strong> €{order.total_amount}
                            </p>

                            <p className="card-row">
                                <strong>Created At:</strong> {order.created_at}
                            </p>

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}