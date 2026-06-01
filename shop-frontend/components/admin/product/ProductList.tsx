import "../general/ComponentList.css";
import type { Product } from "../../../types/products";
import { Alert } from "../../general/alert/Alert";
import { ViewButtonGroup } from "../../general/viewButtonGroup/ViewButtonGroup";
import { QueryBox } from "../general/QueryBox";
import { Spinner } from "../../general/spinner/Spinner";
import { CreateButton } from "../general/createButton/CreateButton";

interface ProductListProps {
    products: Product[] | null;
    loading: boolean;
    alert: {type: "success" | "error", message: string} | null;
    view: "table" | "grid";
    query: string;
    onQueryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onProductClick: (productId: number , action: string) => void;
    onViewChange: (view: "table" | "grid") => void;
    removeAlert: () => void;
}

export function ProductList({
    products,
    loading,
    alert,
    view,
    query,
    onQueryChange,
    onProductClick,
    onViewChange,
    removeAlert
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
        <div className="container">

            {/* ALERT */}
            <Alert alert={alert} onRemoveAlert={removeAlert} />

            <div className="head-container">
                
                <ViewButtonGroup view={view} onViewChange={onViewChange} />

                <QueryBox
                    query={query}
                    keyWord={"Category"}
                    onQueryChange={onQueryChange}
                />

            </div>

            {view === "table" ? (
                <div className="table-container">

                    {/* TABLE VIEW */}

                    <table className="table">
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
                                    className="table-row"
                                >
                                    <td className="table-cell">
                                        <img
                                            src={pr.image_url}
                                            alt={pr.name}
                                            className="table-image"
                                            width="20%"
                                            height="20%"
                                        />
                                    </td>

                                    <td className="table-cell">
                                        {pr.name}
                                    </td>

                                    <td className="table-cell">
                                        €{pr.price}
                                    </td>

                                    <td className="table-cell">
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
                <div className="grid-container">

                    {/* GRID VIEW */}

                    {products.map((pr) => (
                        <div
                            key={pr.id}
                            className="card"
                            onClick={() => onProductClick(pr.id, "update")}
                        >

                            <p className="card-row">
                                <strong>Image:</strong>
                                <img
                                    src={pr.image_url}
                                    alt={pr.name}
                                    className="card-image"
                                    width="60rem"
                                    height="50rem"
                                />
                            </p>

                            <p className="card-row">
                                <strong>Name:</strong> {pr.name}
                            </p>

                            <p className="card-row">
                                <strong>Price:</strong> €{pr.price}
                            </p>

                            <p className="card-row">
                                <strong>Stock:</strong>
                                {+pr.stock > 0
                                    ? `${pr.stock} left`
                                    : "Out of stock"
                                }
                            </p>

                        </div>

                    ))}

                </div>

            )}

            <CreateButton
                name={"product"}
                onNavigateToCreationPage={() => onProductClick(0, "create")}
            />

        </div>
    );
}