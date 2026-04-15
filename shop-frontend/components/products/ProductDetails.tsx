import "./ProductDetails.css";
import type { ProductDetail } from "../../types/products";
import type { Cart } from "../../types/cart";

interface ProductDetailsProps {
    product: ProductDetail | null;
    cart: Cart[] | null;
    quantity: number;
    loading: boolean;
    alert: {type: "success" | "error", message: string} | null;
    handleAddToCart: () => void;
    onQuantityChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    removeAlert: () => void;
}

export function ProductDetails({ product, cart, quantity, loading, alert, handleAddToCart, onQuantityChange, removeAlert }: ProductDetailsProps) {
    if (!product) return null;

    const images = product.images?.length
        ? product.images
        : [product.image_url]

    const foundProduct = cart?.find(ci => ci.product_id === product.id);

    const minQuantity = product.unit === "kg" ? 0.05 : product.unit === "liter" ? 0.5 : 1;

    return (
        <div className="product-details">
            {/* UPPER CENTER - ERROR/SUCCESS MESSAGES*/}
            <div className="alert-container" onMouseEnter={removeAlert}>
                {alert && (
                    <div className={`alert ${alert.type}`}>
                        {alert.message}
                    </div>
                )}
            </div>

            {/* LEFT - IMAGES */}
            <div className="product-images">
                {images.map((img, index) => (
                    <img
                        key={index}
                        src={img}
                        alt={`${product.name} ${index}`}
                        className="product-image"
                    />
                ))}
            </div>

            {/* RIGHT - INFO */}
            <div className="product-info">
                <h1>{product.name}</h1>

                <p className="product-price">
                    €{product.price} / {product.unit}
                </p>

                <p className="product-description">
                    {product.description}
                </p>

                <p className="product-stock">
                    {product.stock > 0
                        ? `In stock (${product.stock})`
                        : "Out of stock"}
                </p>

                {foundProduct && (
                    <p className="product-in-cart">
                        In cart: {foundProduct.quantity}
                    </p>
                )}

                <input type="number" value={quantity} onChange={onQuantityChange} min={minQuantity} max={product.stock} />

                <button type="button" className={loading ? "add-to-cart-disabled" : "add-to-cart"} onClick={handleAddToCart}>
                    {loading ? "Adding to Cart" : "Add to Cart"}
                </button>
                
            </div>
        </div>
    );
}