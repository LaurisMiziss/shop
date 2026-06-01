import "./ProductList.css";
import type { Product } from "../../types/products";
import { Spinner } from "../general/spinner/Spinner";
import { Alert } from "../general/alert/Alert";
import { SearchQuery } from "../general/SearchQuery";

interface ProductListProps {
    products: Product[] | null;
    view: "table" | "grid";
    loading: boolean;
    passedQuery: string | null;
    totalCount: number;
    alert: {type: "success" | "error", message: string} | null;
    removeAlert: () => void;
    onProductClick: (productId: number , action: string) => void;
}

export function ProductList({
    products,
    loading,
    passedQuery,
    totalCount,
    alert,
    view,
    removeAlert,
    onProductClick
}: ProductListProps) {

    if (!products) {
        return (
            <div className="centred-content">
                <p>
                    Error 404
                    <br />
                    Products are not found
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
        <div className="product-list-container">

            {/* ALERT */}
            <Alert alert={alert} onRemoveAlert={removeAlert} />
            
            <SearchQuery
                totalCount={totalCount}
                savedQuery={passedQuery}
            />

            {view === "table" ? (
                <div>

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
                                            src={pr.image_url ? pr.image_url : undefined}
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
            ) : (
                <div className="product-grid">
                    {products.map((pr) => (
                        <div
                            key={pr.id}
                            className="product-card"
                            onClick={() => onProductClick(pr.id, "update")}
                        >

                            <img
                                src={pr.image_url ? pr.image_url : undefined}
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

            )}

        </div>
    );
}