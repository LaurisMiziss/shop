import "./CategoryList.css";
import { Category } from "../../../types/category";

interface CategoryListProps {
    categories: Category[] | null;
    view: "table" | "grid";
    loading: boolean;
    alert: {type: "success" | "error", message: string} | null;
    onCategoryClick: (categoryId: number, action: "update" | "create") => void;
    onViewChange: (view: "table" | "grid") => void;
    removeAlert: () => void;
}

export function CategoryList({ categories, view, loading, alert, onCategoryClick, onViewChange, removeAlert }: CategoryListProps) {
    if (!categories || categories.length === 0) {
        return (
            <p>
                Error 404
                <br />
                Categories are not found
            </p>
        );
    }

    if (loading) {
        return (
            <div>
                Fetching categories from the data base...
            </div>
        );
    }

    const viewButtonGroup = () => {
        return (
            <div className="view-toggle">
                <button
                    type="button"
                    onClick={() => onViewChange("table")}
                    className={view === "table" ? "active" : ""}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-menu-2"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 6l16 0" /><path d="M4 12l16 0" /><path d="M4 18l16 0" /></svg>
                </button>

                <button
                    type="button"
                    onClick={() => onViewChange("grid")}
                    className={view === "grid" ? "active" : ""}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="icon icon-tabler icons-tabler-filled icon-tabler-layout-grid"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M9 3a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-4a2 2 0 0 1 -2 -2v-4a2 2 0 0 1 2 -2z" /><path d="M19 3a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-4a2 2 0 0 1 -2 -2v-4a2 2 0 0 1 2 -2z" /><path d="M9 13a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-4a2 2 0 0 1 -2 -2v-4a2 2 0 0 1 2 -2z" /><path d="M19 13a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-4a2 2 0 0 1 -2 -2v-4a2 2 0 0 1 2 -2z" /></svg>
                </button>
            </div>
        );
    };

    return (
        <div className="category-container">

            {/* ALERT */}
            <div className="alert-container" onMouseEnter={removeAlert}>
                {alert && (
                    <div className={`alert ${alert.type}`}>
                        {alert.message}
                    </div>
                )}
            </div>

            {viewButtonGroup()}

            {view === "table" ? (
                <div className="category-table-container">
                    {/* CATEGORIES TABLE VIEW */}
                    <table className="category-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Display Order</th>
                            </tr>
                        </thead>

                        <tbody>
                            {categories.map(category => {
                                return (
                                    <tr
                                        key={category.id}
                                        onClick={() => onCategoryClick(category.id, "update")}
                                        className="category-table-row"
                                    >
                                        <td className="category-table-id">
                                            {category.id}
                                        </td>

                                        <td>
                                            <img
                                                src={category.image_url ? category.image_url : undefined}
                                                alt={category.name}
                                                className="category-table-image"
                                            />
                                        </td>

                                        <td className="category-table-name">
                                            {category.name}
                                        </td>

                                        <td className="category-table-display-order">
                                            {category.display_order}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="category-grid">
                    {/* CATEGORIES GRID VIEW */}
                    {categories.map(category => (
                        <div
                            key={category.id}
                            className="category-card"
                            onClick={() => onCategoryClick(category.id, "update")}
                        >
                            <img
                                src={category.image_url ? category.image_url : undefined}
                                alt={category.name}
                            />

                            <div className="category-card-body">
                                <p className="category-card-name">
                                    {category.name}
                                </p>

                                <p className="category-card-id">
                                    ID: {category.id}
                                </p>

                                <p className="category-card-order">
                                    Display Order: {category.display_order}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
}