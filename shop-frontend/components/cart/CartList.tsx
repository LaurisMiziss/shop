import "./CartList.css";
import type { Cart } from "../../types/cart";
import { Spinner } from "../general/spinner/Spinner";
import { Alert } from "../general/alert/Alert";

interface CartListProps {
    cart: Cart[] | null;
    selectedItems: Cart[] | null;
    selected: {product: Cart, quantity: number} | null;
    loading: boolean;
    alert: {type: "success" | "error", message: string} | null;
    view: "grid" | "table";
    updateSelected: (product: Cart, e: React.ChangeEvent<HTMLInputElement>) => void;
    onQuantityChange: ( e: React.KeyboardEvent<HTMLInputElement>) => void;
    onDeleteClick: (productId: number) => void;
    onNavigateToShop: () => void;
    onNavigateToProductDetails: (productId: number) => void;
    removeAlert: () => void;
    selectItem: (selected: boolean, ci: Cart) => void;
    onNavigateToOrderCreation: () => void;
    onRemoveSelectedCartItems: () => void;
}

export function CartList({
    cart,
    view,
    selectedItems,
    selected,
    loading,
    alert,
    updateSelected,
    onQuantityChange,
    onDeleteClick,
    onNavigateToShop,
    onNavigateToProductDetails,
    removeAlert,
    selectItem,
    onNavigateToOrderCreation,
    onRemoveSelectedCartItems
}: CartListProps) {

    if (!cart || cart.length === 0) {
        return (
            <div className="centred-content">
                <p>Your cart is empty...</p>
                <p onClick={onNavigateToShop}><b>Click me to search for a products!</b></p>
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

    const isSelected = (currentCi: Cart): boolean => {
        if (!selectedItems) return false;

        const isSelected = selectedItems.find(ci => ci.product_id === currentCi.product_id);

        if (!isSelected) return false;
        
        return true;
    } 

    let totalCost = 0;

    return (
        <div className="cart-container">

            {/* ALERT */}
            <Alert alert={alert} onRemoveAlert={removeAlert} />

            {view === "table" ? (
                <div>

                    <table className="cart-table">

                        <thead>

                            <tr>
                                <th>Selected</th>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Quantity</th>
                                <th>Total price</th>
                                <th>Action</th>
                            </tr>
                            
                        </thead>

                        <tbody>
                            {cart.map((ci) => {
                                const totalItemCost = ci.quantity * +ci.price;
                                const result = isSelected(ci);
                                if (result) totalCost+= totalItemCost;
                                return (
                                    <tr
                                        key={ci.id}
                                        className="cart-table-row"
                                    >   

                                        <td onClick={() => selectItem(result, ci)}>
                                            <div className={result ? "selected-circle" : "not-selected-circle"}>
                                                {result ? "O" : "X"}
                                            </div>
                                        </td>
                                        
                                        <td>
                                            <img
                                                src={ci.image_url ? ci.image_url : undefined}
                                                alt={ci.name}
                                                className="cart-table-image"
                                            />
                                        </td>

                                        <td className="cart-table-name" onClick={() => onNavigateToProductDetails(ci.product_id)}>
                                            {ci.name}
                                        </td>

                                        <td className="cart-table-price">
                                            €{ci.price} / {ci.unit}
                                        </td>

                                        <td
                                            className={
                                                +ci.stock > 0
                                                    ? "cart-table-stock"
                                                    : "cart-table-stock out"
                                            }
                                        >
                                            {ci.stock > 0
                                            ? `${ci.stock} left`
                                            : "Out of stock"}
                                        </td>

                                        <td className="cart-table-quantity">
                                            <input
                                                type="number"
                                                value={selected && ci.product_id === selected.product.product_id ? selected.quantity : ci.quantity}
                                                min="0"
                                                onChange={(e) => updateSelected(ci, e)}
                                                onKeyDown={(e) =>
                                                    onQuantityChange(e)
                                                }
                                            />
                                        </td>

                                        <td className="cart-table-ci-price">
                                            Price for item: €{totalItemCost.toFixed(2)}
                                        </td>

                                        <td>
                                            <button
                                                className="cart-card-delete"
                                                onClick={() => onDeleteClick(ci.product_id)}
                                            >
                                                Remove
                                            </button>
                                        </td>

                                    </tr>

                            )})}

                        </tbody>

                    </table>

                </div>
            ) : (
                <div className="cart-grid">

                {cart.map((ci) => {
                    const totalItemCost = ci.quantity * +ci.price;
                    const result = isSelected(ci);
                    if (result) totalCost+= totalItemCost;
                    return (
                        <div key={ci.id} className="cart-card">
                            <div className={result ? "selected" : "not-selected"} onClick={() => selectItem(result, ci)}>
                                {result ? "O" : "X"}
                            </div>

                            {/* IMAGE */}
                            <img
                                src={ci.image_url}
                                alt={ci.name}
                                className="cart-card-image"
                            />

                            {/* BODY */}
                            <div className="cart-card-body">

                                <p
                                    className="cart-card-name"
                                    onClick={() => onNavigateToProductDetails(ci.product_id)}
                                >
                                    {ci.name}
                                </p>

                                <p className="cart-card-price">
                                    €{ci.price} / {ci.unit}
                                </p>

                                <p className="cart-card-stock">
                                    {ci.stock > 0
                                        ? `${ci.stock} left`
                                        : "Out of stock"}
                                </p>

                                {/* QUANTITY */}
                                <div className="cart-card-quantity">
                                    <label htmlFor={`quantity${ci.name}`}>Quantity:</label>
                                    <input
                                        id={`quantity${ci.name}`}
                                        type="number"
                                        value={selected && ci.product_id === selected.product.product_id ? selected.quantity : ci.quantity}
                                        min="0"
                                        max={ci.stock}
                                        onChange={(e) => updateSelected(ci, e)}
                                        onKeyDown={(e) =>
                                            onQuantityChange(e)
                                        }
                                    />

                                    <p className="cart-card-guide">Press enter to apply or escape to undo changes</p>
                                </div>

                                {/* TOTAL PRICE */}
                                <div className="cart-card-total-item">
                                    <p>
                                        Price for item: €{totalItemCost.toFixed(2)}
                                    </p>
                                </div>

                                {/* ACTIONS */}
                                <button
                                    className="cart-card-delete"
                                    onClick={() => onDeleteClick(ci.product_id)}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>

                    )

                })}

            </div>

            )}

            {/* FOOTER */}
            <div className="cart-footer">
                <p className="cart-card-total">
                    Total price: <b>€{totalCost.toFixed(2)}</b>
                </p>
                <button className={`pay-button ${(!selectedItems || selectedItems.length === 0) && "disabled"}`} onClick={onNavigateToOrderCreation}>
                    Pay
                </button>
                <button className={`delete-button ${(!selectedItems || selectedItems.length === 0) && "disabled"}`} onClick={onRemoveSelectedCartItems}>
                    Remove
                </button>
            </div>

        </div>
    );
}