import "./CartList.css";
import type { Cart } from "../../types/cart";

interface CartListProps {
    cart: Cart[] | null;
    selectedItems: Cart[] | null;
    name: string;
    selected: {product: Cart, quantity: number} | null;
    loading: boolean;
    alert: {type: "success" | "error", message: string} | null;
    updateSelected: (product: Cart, e: React.ChangeEvent<HTMLInputElement>) => void;
    onQuantityChange: ( e: React.KeyboardEvent<HTMLInputElement>) => void;
    onDeleteClick: (productId: number) => void;
    onNavigateToShop: () => void;
    onNavigateToProductDetails: (productId: number) => void;
    removeAlert: () => void;
    selectItem: (selected: boolean, ci: Cart) => void;
    onNavigateToOrderCreation: () => void;
}

export function CartList({
    cart,
    selectedItems,
    name,
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
    onNavigateToOrderCreation
}: CartListProps) {
    if (loading) {
        return <p className="status-message">Loading products...</p>;
    }

    if (name.length > 0 && (!cart || cart.length === 0)) {
        return  (
            <p className="status-message">Products with such name are not found</p>
        );
    }

    if (!cart || cart.length === 0) {
        return  (
            <p className="status-message">
                You cart is empty...
                <br />
                <a onClick={onNavigateToShop}>Click me to visit shop page!</a>
                </p>
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
            <div className="alert-container" onMouseEnter={removeAlert}>
                {alert && (
                    <div className={`alert ${alert.type}`}>
                        {alert.message}
                    </div>
                )}
            </div>

            {/* CART LIST */}
            <div className="cart-grid">
                {cart.map((ci) => {
                    const totalItemCost = ci.quantity * +ci.price;
                    const result = isSelected(ci);
                    if (result) totalCost+= totalItemCost;
                    return (
                        <div key={ci.id} className="cart-card">
                            <div className={result ? "selected" : "not-selected"} onClick={() => selectItem(result ? true : false, ci)}>
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
                                {cart.length > 0 && (
                                    <div className="cart-card-total-item">
                                        <p>
                                            Price for item: €{totalItemCost.toFixed(2)}
                                        </p>
                                    </div>
                                )}

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

            {/* FOOTER */}
            <div className="cart-footer">
                <p className="cart-card-total">
                    Total price: €{totalCost.toFixed(2)}
                </p>
                <button className="pay-button" onClick={onNavigateToOrderCreation}>
                    Pay
                </button>
            </div>
        </div>
    );
}