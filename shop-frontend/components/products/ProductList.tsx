import "./ProductList.css";
import type { Product } from "../../types/products";

interface ProductListProps {
    products: Product[] | null;
    onProductClick: (productId: number , action: string) => void;
    loading: boolean;
    error: string | null;
    tableView: boolean;
    onViewChange: (view: string) => void;
}

export function ProductList({
    products,
    onProductClick,
    loading,
    error,
    tableView,
    onViewChange
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

    const viewButtonGroup = () => {
        return (
            <div>
                <button type="button" onClick={() => onViewChange("table")}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-menu-2"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 6l16 0" /><path d="M4 12l16 0" /><path d="M4 18l16 0" /></svg>
                </button>

                <button type="button" onClick={() => onViewChange("grid")}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="icon icon-tabler icons-tabler-filled icon-tabler-layout-grid"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M9 3a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-4a2 2 0 0 1 -2 -2v-4a2 2 0 0 1 2 -2z" /><path d="M19 3a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-4a2 2 0 0 1 -2 -2v-4a2 2 0 0 1 2 -2z" /><path d="M9 13a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-4a2 2 0 0 1 -2 -2v-4a2 2 0 0 1 2 -2z" /><path d="M19 13a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-4a2 2 0 0 1 -2 -2v-4a2 2 0 0 1 2 -2z" /></svg>
                </button>
            </div>
        );
    };

    if (tableView) {
        return (
            <div className="product-table-container">

                {viewButtonGroup()}
                
                <table className="product-table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Stock</th>
                        </tr>
                    </thead>

                    <tbody>
                        {products.map((pr) => (
                            <tr
                                key={pr.id}
                                onClick={() => onProductClick(pr.id, "update")}
                                className="product-table-row"
                            >
                                <td>
                                    <img
                                        src={pr.image_url}
                                        alt={pr.name}
                                        className="product-table-image"
                                    />
                                </td>

                                <td className="product-table-name">
                                    {pr.name}
                                </td>

                                <td className="product-table-price">
                                    €{pr.price}
                                </td>

                                <td
                                    className={
                                        +pr.stock > 0
                                            ? "product-table-stock"
                                            : "product-table-stock out"
                                    }
                                >
                                    {+pr.stock > 0
                                        ? `${pr.stock} left`
                                        : "Out of stock"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    return (
        <div>

            {viewButtonGroup()}

            <div className="product-grid">
                {products.map((pr) => (
                    <div
                        key={pr.id}
                        className="product-card"
                        onClick={() => onProductClick(pr.id, "update")}
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
                                {+pr.stock > 0
                                    ? `${pr.stock} left`
                                    : "Out of stock"}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
                
        </div>
    );
}
