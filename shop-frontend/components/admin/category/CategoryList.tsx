import "../general/ComponentList.css";
import type { Category } from "../../../types/category";
import { Alert } from "../../general/alert/Alert";
import { ViewButtonGroup } from "../../general/viewButtonGroup/ViewButtonGroup";
import { QueryBox } from "../general/QueryBox";
import { Spinner } from "../../general/spinner/Spinner";
import { CreateButton } from "../general/createButton/CreateButton";

interface CategoryListProps {
    categories: Category[] | null;
    view: "table" | "grid";
    loading: boolean;
    alert: {type: "success" | "error", message: string} | null;
    query: string;
    onQueryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onCategoryClick: (categoryId: number, action: "update" | "create") => void;
    onViewChange: (view: "table" | "grid") => void;
    removeAlert: () => void;
}

export function CategoryList({
    categories,
    view,
    loading,
    alert,
    query,
    onQueryChange,
    onCategoryClick,
    onViewChange,
    removeAlert
}: CategoryListProps) {

    if (!categories) {
        return (
            <div className="centred-content">
                <p>
                    Error 404
                    <br />
                    Categories are not found
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
                                        className="table-row"
                                    >

                                        <td className="table-cell">
                                            {category.id}
                                        </td>

                                        <td className="table-cell">
                                            <img
                                                src={category.image_url ? category.image_url : undefined}
                                                alt={category.name}
                                                className="table-image"
                                                width="15%"
                                                height="10%"
                                            />
                                        </td>

                                        <td className="table-cell">
                                            {category.name}
                                        </td>

                                        <td className="table-cell">
                                            {category.display_order}
                                        </td>

                                    </tr>

                                );

                            })}

                        </tbody>

                    </table>

                </div>
            ) : (
                <div className="grid-container">

                    {/* GRID VIEW */}

                    {categories.map(category => (
                        <div
                            key={category.id}
                            className="card"
                            onClick={() => onCategoryClick(category.id, "update")}
                        >
                            <p className="card-row">
                                <strong>ID:</strong> {category.id}
                            </p>

                            <p className="card-row">
                                <strong>Image:</strong>
                                <img
                                    src={category.image_url ? category.image_url : undefined}
                                    alt={category.name}
                                    className="grid-image"
                                    sizes="15%"
                                />
                            </p>

                            <p className="card-row">
                                <strong>Name:</strong> {category.name}
                            </p>

                            <p className="card-row">
                                <strong>Display Order:</strong> {category.display_order}
                            </p>

                        </div>

                    ))}

                </div>

            )}

            <CreateButton
                name={"category"}
                onNavigateToCreationPage={() => onCategoryClick(0, "create")}
            />

        </div>
    );
}