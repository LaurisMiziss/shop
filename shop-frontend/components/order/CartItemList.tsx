import "./CartItemList.css";
import type { Cart } from "../../types/cart";

interface CartItemListProps {
    cart: Cart[] | null;
}

export function CartItemList({ cart }: CartItemListProps) {

  if (!cart || cart.length === 0) {
    return <p className="status-message">Your order is empty</p>;
  }

  const totalCost = cart.reduce((sum, ci) => {
    return sum + ci.quantity * Number(ci.price);
  }, 0);

  return (
    <div className="order-items">
      <h3 className="order-items-title">Items in your order</h3>

      <ul className="order-items-list">
        {cart.map((ci) => {
          const totalItemCost = ci.quantity * Number(ci.price);

          return (
            <li key={ci.id} className="order-item">

              {/* IMAGE */}
              <img
                src={ci.image_url}
                alt={ci.name}
                className="order-item-image"
              />

              {/* INFO */}
              <div className="order-item-info">
                <p className="order-item-name">{ci.name}</p>

                <p className="order-item-meta">
                  €{ci.price} × {ci.quantity}
                </p>
              </div>

              {/* TOTAL */}
              <div className="order-item-total">
                €{totalItemCost.toFixed(2)}
              </div>

            </li>
          );
        })}
      </ul>

      {/* TOTAL */}
      <div className="order-total">
        <span>Total:</span>
        <strong>€{totalCost.toFixed(2)}</strong>
      </div>
    </div>
  );
}