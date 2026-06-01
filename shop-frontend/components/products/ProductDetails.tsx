import "./ProductDetails.css";
import { useState } from "react";
import type { ProductDetail } from "../../types/products";
import type { Cart } from "../../types/cart";
import { Alert } from "../general/alert/Alert";
import { Spinner } from "../general/spinner/Spinner";

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

export function ProductDetails({
    product,
    cart,
    quantity,
    loading,
    alert,
    handleAddToCart,
    onQuantityChange,
    removeAlert
}: ProductDetailsProps) {
    const [selectedImage, setSelectedImage] = useState(0);

    if (!product) {
        return (
            <p>
                Error 404
                <br />
                Product is not found
            </p>
        )
    }

    if (loading) {
        return (
            <div className="centred-content">
                <Spinner size={32} />
            </div>
        );
    }

    const images = product.images?.length
        ? product.images
        : [product.image_url]

    const foundProduct = cart?.find(ci => ci.product_id === product.id);

    const minQuantity = product.unit === "kg" ? 0.05 : product.unit === "liter" ? 0.5 : 1;

    return (
        <div className="product-details">

            <Alert alert={alert} onRemoveAlert={removeAlert} />

            {/* LEFT */}
            <div className="product-images">

                {/* MAIN IMAGE */}
                <img
                    src={images[selectedImage] || ""}
                    alt={product.name}
                    className="product-main-image"
                />

                {/* THUMBNAILS */}
                <div className="product-thumbnails">
                    {images.map((img, index) => (
                        <img
                            key={index}
                            src={img || ""}
                            alt={`${product.name} ${index}`}
                            className={`product-thumb ${selectedImage === index ? "active" : ""}`}
                            onClick={() => setSelectedImage(index)}
                        />
                    ))}
                </div>
            </div>

            {/* RIGHT */}
            <div className="product-info">
                <h1>{product.name}</h1>

                <p className="product-price">
                    €{product.price} / {product.unit}
                </p>

                <p className="product-description">
                    {product.description}
                </p>

                <p className={`product-stock ${+product.stock > 0 ? "in" : "out"}`}>
                    {+product.stock > 0
                        ? `In stock (${product.stock})`
                        : "Out of stock"}
                </p>

                {foundProduct && (
                    <p className="product-in-cart">
                        In cart: {foundProduct.quantity}
                    </p>
                )}

                {/* QUANTITY + BUTTON */}
                <div className="product-actions">
                    <input
                        type="number"
                        value={quantity}
                        onChange={onQuantityChange}
                        min={minQuantity}
                        max={product.stock}
                        className="quantity-input"
                    />

                    <button
                        type="button"
                        className={loading ? "add-to-cart-disabled" : "add-to-cart"}
                        onClick={handleAddToCart}
                    >
                        {loading ? "Adding..." : "Add to Cart"}
                    </button>
                </div>
            </div>
        </div>
    );
}