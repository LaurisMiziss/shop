import "./ProductDetails.css";
import type { ProductDetail } from "../../types/products";

interface ProductDetailsProps {
    product: ProductDetail | null;
}

export function ProductDetails({ product }: ProductDetailsProps) {
    if (!product) return null;

    const images = product.images?.length
        ? product.images
        : [product.image_url];

    return (
        <div className="product-details">
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

                <button className="add-to-cart">
                    Add to Cart
                </button>
            </div>
        </div>
    );
}