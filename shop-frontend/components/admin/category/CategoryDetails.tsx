import { Category } from "../../../types/category";
import { CategoryEditFieldErrors } from "../../../types/fieldErrors";

interface CategoryDetailsProps {
    action: "create" | "update"
    oldCategory: Category | null;
    category: Category | null;
    imageUrl: string;
    alert: {type: "success" | "error", message: string} | null;
    fieldErrors: CategoryEditFieldErrors;
    loading: boolean;
    onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onImageUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onDisplayOrderChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onIsActiveChange: () => void;
    onUndoClick: (field: string | undefined) => void;
    removeAlert: () => void;
    updateCategory: (e: React.FormEvent<HTMLFormElement>) => void;
    postCategory: (e: React.FormEvent<HTMLFormElement>) => void;
    handleDeleteClick: () => void;
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
    onDescriptionChange,
    onImageUrlChange,
    onDisplayOrderChange,
    onIsActiveChange,
    onUndoClick,
    removeAlert,
    updateCategory,
    postCategory,
    handleDeleteClick
}: CategoryDetailsProps) {

    if (!oldCategory || !category) {
        return (
            <p>
                404 Error
                <br />
                Category is not found
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

    const undoButton = (field: string) => {
        if (!allowedFields.includes(field as FieldName)) {
            return (
                <p>Invalid field</p>
            );
        }

        return (
            <button type="button" onClick={() => onUndoClick(field)} disabled={loading}>
                Undo
            </button>
        );
    };

    return (
        <div className="page">

            {/* ALERT */}
            <div className="alert-container" onMouseEnter={removeAlert}>
                {alert && (
                    <div className={`alert ${alert.type}`}>
                        {alert.message}
                    </div>
                )}
            </div>

            <h2 className="page-title">
                {action === "update" ? `Editing ${oldCategory.name}` : `Creating a new category`}
            </h2>

            <form className="form-card" onSubmit={action === "update" ? updateCategory : postCategory}>

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
                            onChange={onDescriptionChange}
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
                </section>

                {/* DISPLAY ORDER */}
                <section className="form-section">
                    <div className="form-group">
                        <label htmlFor="pr-display-order">Display order:</label>
                        <input
                            type="text"
                            id="pr-display-order"
                            placeholder="4"
                            value={category.display_order}
                            onChange={onDisplayOrderChange}
                        />
                        {fieldErrors.image_url && fieldError("display_order")}
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

            </form>

        </div>
    );
}