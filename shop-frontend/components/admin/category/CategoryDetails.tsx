import "../general/ComponentDetails.css";
import type { Category } from "../../../types/category";
import type { CategoryEditFieldErrors } from "../../../types/fieldErrors";
import { Alert } from "../../general/alert/Alert";

interface CategoryDetailsProps {
    action: "create" | "update" | null;
    oldCategory: Category | null;
    category: Category | null;
    imageUrl: string;
    alert: {type: "success" | "error", message: string} | null;
    fieldErrors: CategoryEditFieldErrors;
    loading: boolean;
    onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onDescChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onImageUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onOrderChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onIsActiveChange: () => void;
    removeAlert: () => void;
    postCategory: (e: React.FormEvent<HTMLFormElement>) => void;
    updateCategory: (e: React.FormEvent<HTMLFormElement>) => void;
    onUndoClick: (field: "name" | "description" | "image_url" | "display_order" | "is_active" | undefined) => void;
    onDeleteClick: () => void;
}

export function CategoryDetails({
    action,
    oldCategory,
    category,
    imageUrl,
    alert,
    fieldErrors,
    loading,
    onNameChange,
    onDescChange,
    onImageUrlChange,
    onOrderChange,
    onIsActiveChange,
    removeAlert,
    postCategory,
    updateCategory,
    onUndoClick,
    onDeleteClick
}: CategoryDetailsProps) {

    if (!oldCategory || !category || !action) {
        return (
            <p>
                404 Error
                <br />
                Category or action is not found
            </p>
        );
    }

    const allowedFields = ["name", "description", "image_url", "display_order", "is_active"] as const;

    type FieldName = typeof allowedFields[number];

    const fieldError = (field: string) => {
        if (!allowedFields.includes(field as FieldName)) {
            return <p>Invalid field</p>
        }

        const key = field as FieldName;

        return <span className="field-error">{fieldErrors[key]}</span>;
    };

    const undoButton = (field: "name" | "description" | "image_url" | "display_order" | "is_active" | undefined) => {
        return (
            <button type="button" onClick={() => onUndoClick(field)} disabled={loading} className="action-btn">
                Undo Changes
            </button>
        );
    };

    return (
        <div className="page">

            {/* ALERT */}
            <Alert alert={alert} onRemoveAlert={removeAlert} />

            <h2 className="page-title">
                {action === "update" ? `Editing ${oldCategory.name}` : `Creating a new category`}
            </h2>

            <form onSubmit={action === "update" ? updateCategory : postCategory}>

                {/* NAME */}
                <section className="form-section">
                    <div className="form-group">
                        <label htmlFor="pr-name">Name:</label>
                        <input
                            type="text"
                            id="pr-name"
                            placeholder="Vegetables"
                            required
                            minLength={2}
                            value={category.name}
                            onChange={onNameChange}
                        />
                        {fieldErrors.name && fieldError("name")}
                        {undoButton("name")}
                    </div>
                </section>

                {/* DESCRIPTION */}
                <section className="form-section">
                    <div className="form-group">
                        <label htmlFor="pr-desc">Description:</label>
                        <textarea
                            id="pr-desc"
                            placeholder="Fresh seasonal fruits"
                            value={category.description}
                            onChange={onDescChange}
                            maxLength={1000}
                        />
                        {fieldErrors.description && fieldError("description")}
                        {undoButton("description")}
                    </div>
                </section>

                {/* IMAGE URL */}
                <section className="form-section">
                    <div className="form-group">
                        <label htmlFor="pr-image-url">Image URL:</label>
                        <input
                            type="text"
                            id="pr-image-url"
                            placeholder="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQAB..."
                            value={imageUrl}
                            onChange={onImageUrlChange}
                        />
                        {fieldErrors.image_url && fieldError("image_url")}
                        {undoButton("image_url")}
                    </div>
                    {category.image_url && (
                        <div className="form-group">
                            <img src={category.image_url} alt={`Photo of ${oldCategory.name.toLocaleLowerCase()}`} width="30%" height="30%" />
                        </div>
                    )}
                </section>

                {/* DISPLAY ORDER */}
                <section className="form-section">
                    <div className="form-group">
                        <label htmlFor="pr-display-order">Display order:</label>
                        <input
                            type="number"
                            id="pr-display-order"
                            placeholder="4"
                            required
                            value={category.display_order}
                            onChange={onOrderChange}
                        />
                        {fieldErrors.display_order && fieldError("display_order")}
                        {undoButton("display_order")}
                    </div>
                </section>

                {/* IS ACTIVE */}
                <section className="form-section">
                    <div className="form-group">
                        <label htmlFor="pr-is-active">Is Active:</label>
                        <input
                            type="checkbox"
                            id="pr-is-active"
                            checked={category.is_active}
                            onChange={onIsActiveChange}
                        />
                        {fieldErrors.is_active && fieldError("is_active")}
                        {undoButton("is_active")}
                    </div>
                </section>

                {/* MAIN BUTTONS */}
                <section className="form-section">
                    <div className="button-group">
                        <button type="submit" disabled={loading} className="action-btn">
                            {action === "update" ? "Save Changes" : "Create Product"}
                        </button>
                        {undoButton(undefined)}
                        {action === "update" && (
                            <button type="button" onClick={onDeleteClick} disabled={loading} className="action-btn">
                                Delete Category
                            </button>
                        )}
                    </div>
                </section>

            </form>

        </div>
    );
}