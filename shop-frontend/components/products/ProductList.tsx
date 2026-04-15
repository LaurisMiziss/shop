import "./ProductList.css";
import type { Product } from "../../types/products";

interface ProductListProps {
    products: Product[] | null;
    onProductClick: (productId: number) => void;
    loading: boolean;
    error: string | null;
}

export function ProductList({
    products,
    onProductClick,
    loading,
    error,
}: ProductListProps) {
    if (loading) {
        return <p className="status-message">Loading products...</p>;
    }

    if (error) {
        return <p className="error-message">{error}</p>;
    }

    if (!products || products.length === 0) {
        return <p className="status-message">No products found</p>;
    }

    return (
        <div className="product-grid">
            {products.map((pr) => (
                <div
                    key={pr.id}
                    className="product-card"
                    onClick={() => onProductClick(pr.id)}
                >
                    <img
                        src={pr.image_url}
                        alt={pr.name}
                        className="product-card-image"
                    />

                    <div className="product-card-body">
                        <p className="product-card-name">{pr.name}</p>

                        <p className="product-card-price">
                            €{pr.price}
                        </p>

                        <p className="product-card-stock">
                            {pr.stock > 0
                                ? `${pr.stock} left`
                                : "Out of stock"}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
