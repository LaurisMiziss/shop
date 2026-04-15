import "./ProductDetail.css";
import type { ProductDetail } from "../../../types/products";
import type { Category } from "../../../types/category";
import type { ProductEditFieldErrors } from "../../../types/fieldErrors";

interface ProductDetailsProps {
    action: "create" | "update" | null;
    oldProduct: ProductDetail | null;
    product: ProductDetail | null;
    imageUrl: string;
    imagesUrl: string;
    alert: {type: "success" | "error", message: string} | null;
    loading: boolean;
    fieldErrors: ProductEditFieldErrors;
    categories: Category[] | null;
    onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onPriceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onStockChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onCategoryChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onImageUrlChange: (e: React.ChangeEvent<HTMLInputElement>, url: number) => void;
    onImageSave: () => void;
    onImagesSave: () => void;
    onDeleteImage: () => void;
    onDeleteImages: (url: string) => void;
    onIsActiveChange: () => void;
    onIsFeaturedChange: () => void;
    onDescChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onSKUChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onWeightChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onUnitChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onUndoClick: (field: string | undefined) => void;
    removeAlert: () => void;
    updateProduct: (e: React.FormEvent<HTMLFormElement>) => void;
    handleDeleteClick: () => void;
    postProduct: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function ProductDetails({
    action,
    oldProduct,
    product,
    imageUrl,
    imagesUrl,
    alert,
    loading,
    fieldErrors,
    categories,
    onNameChange,
    onPriceChange,
    onStockChange,
    onCategoryChange,
    onImageUrlChange,
    onImageSave,
    onImagesSave,
    onDeleteImage,
    onDeleteImages,
    onIsActiveChange,
    onIsFeaturedChange,
    onDescChange,
    onSKUChange,
    onWeightChange,
    onUnitChange,
    onUndoClick,
    removeAlert,
    updateProduct,
    handleDeleteClick,
    postProduct
}: ProductDetailsProps) {

    if (!product) {
        return (
            <p>
                404 Error
                <br />
                Product is not found
            </p>
        );
    }

    const allowedFields = [
        "name", "price", "stock", "category_id", "image_url", "is_active", "is_featured", "description", "sku", "images", "weight", "unit"
    ] as const;

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
                Editing "{oldProduct ? oldProduct.name.toLocaleLowerCase() : product.name.toLocaleLowerCase()}"
            </h2>
            
            <form className="form-card" onSubmit={action === "update" ? updateProduct : postProduct}>
                    
                {/* NAME */}
                <section className="form-section">
                    <div className="form-group">
                        <label htmlFor="pr-name">Name:</label>
                        <input
                            type="text"
                            id="pr-name"
                            placeholder="Bananas"
                            required
                            minLength={2}
                            value={product.name}
                            onChange={onNameChange}
                        />
                        {fieldErrors.name && fieldError("name")}
                        {undoButton("name")}
                    </div>
                </section>

                {/* PRICE */}
                <section className="form-section">
                    <div className="form-group">
                        <label htmlFor="pr-price">Price:</label>
                        <input
                            type="text"
                            id="pr-price"
                            placeholder="10.66"
                            required
                            minLength={1}
                            value={product.price}
                            onChange={onPriceChange}
                        />
                        {undoButton("price")}
                        {fieldErrors.price && (
                            <div>
                                {fieldError("price")}
                                <p>Behind dot should be not more than 2 numbers</p>
                            </div>
                        )}
                    </div>
                </section>
                
                {/* STOCK */}
                <section className="form-section">
                    <div className="form-group">
                        <label htmlFor="pr-stock">Stock:</label>
                        <input
                            type="text"
                            id="pr-stock"
                            placeholder="132"
                            required
                            minLength={1}
                            value={product.stock}
                            onChange={onStockChange}
                        />
                        {undoButton("stock")}
                        {fieldErrors.stock && (
                            <div>
                                {fieldError("stock")}
                                <p>If out of stock, type 0</p>
                                <p>If product type is pieces, it should not be decimal number</p>
                                <p>If it is decimal number then write three numbers behind dot</p>
                            </div>
                        )}
                    </div>
                </section>
                
                {/* CATEGORY */}
                <section className="form-section">
                    <div className="form-group">
                        <label htmlFor="pr-category-id">Category:</label>
                        {categories ? (
                            <div className="form-row">
                                <select value={product.category_id} onChange={onCategoryChange} required>
                                    {categories.map(category => {
                                        return (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        );
                                    })}
                                </select>
                                {undoButton("category_id")}
                                {fieldErrors.category_id && fieldError("category_id")}
                            </div>
                        ) : (
                            <p>Was unable to retrieve categories</p>
                        )}
                    </div>
                </section>
                
                {/* IMAGE URL */}
                <section className="form-section">
                    <div className="form-group">
                        <label htmlFor="pr-img-url">Image url:</label>
                        <input
                            type="text"
                            id="pr-img-url"
                            value={imageUrl}
                            placeholder="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQAB..."
                            onChange={(e) => onImageUrlChange(e, 1)}
                        />
                        <div className="button-group">
                            <button type="button" onClick={onImageSave}>
                                Save
                            </button>
                            {undoButton("image_url")}
                            <button type="button" onClick={onDeleteImage}>
                                Delete
                            </button>
                        </div>
                        {fieldErrors.image_url && (
                            <div className="form-group">
                                {fieldError("image_url")}
                                <p>Product can have only one main picture</p>
                                <p>After pressing "Save" button old picture will be deleted</p>
                            </div>
                        )}
                        <div className="form-row">
                            {product.image_url ? (
                                <img src={product.image_url} alt="Product main image" width={100} height={80} /> 
                            ) : (
                                "This product do not have any attached to it picture"
                            )}
                        </div>
                    </div>
                </section>
                
                {/* IS ACTIVE */}
                <section className="form-section">
                    <div className="form-group">
                        <label htmlFor="pr-is-active" className="switch">
                            Is active:
                            <input 
                                id="pr-is-active" 
                                type="checkbox" 
                                onChange={onIsActiveChange}
                                checked={product.is_active}
                            />
                            <span className="slider"></span>
                        </label>
                        {undoButton("is_active")}
                        {fieldErrors.is_active && fieldError("is_active")}
                    </div>
                </section>
                
                {/* IS FEATURED */}
                <section className="form-section">
                    <div className="form-group">
                        <label htmlFor="pr-is-featured" className="switch">
                            Is featured:
                            <input 
                                id="pr-is-featured" 
                                type="checkbox"
                                onChange={onIsFeaturedChange} 
                                checked={product.is_featured}
                            />
                            <span className="slider"></span>
                        </label>
                        {undoButton("is_featured")}
                        {fieldErrors.is_featured && fieldError("is_featured")}
                    </div>
                </section>
                
                {/* DESCRIPTION */}
                <section className="form-section">
                    <div className="form-group">
                        <label htmlFor="pr-desc">Description:</label>
                        <textarea
                            id="pr-desc"
                            maxLength={1000}
                            placeholder="Apples from the Netherland fields..."
                            value={product.description}
                            onChange={onDescChange}
                        />
                        {undoButton("description")}
                        {fieldErrors.description && fieldError("description")}
                    </div>
                </section>

                {/* SKU */}
                <section className="form-section">
                    <div className="form-group">
                        <label htmlFor="pr-sku">SKU:</label>
                        <input
                            type="text"
                            id="pr-sku"
                            maxLength={7}
                            placeholder="MEA-005"
                            value={product.sku}
                            onChange={onSKUChange}
                        />
                        {undoButton("sku")}
                        {fieldErrors.sku && (
                            <div>
                                <span className="field-error">{fieldErrors.sku}</span>
                                <p>Format is three letters of product, hyphen and three number, for example, "Tomatoes" -{">"} TOM-001</p>
                            </div>
                        )}
                    </div>
                </section>
                
                {/* IMAGES */}
                <section className="form-section">
                    <div className="form-group">
                        <label htmlFor="pr-images">Images:</label>
                        <input
                            type="text"
                            id="pr-images"
                            placeholder="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQAB..."
                            value={imagesUrl}
                            onChange={(e) => onImageUrlChange(e, 2)}
                        />

                        <div className="button-group">
                            <button type="button" onClick={onImagesSave}>
                                Save
                            </button>
                            {undoButton("images")}
                        </div>

                        {fieldErrors.images && fieldError("images")}
                        <p>Paste one url then click save</p>

                        <div className="form-row">
                            <label>Uploaded image{`(s)`} {`(${product.images ? product.images.length : 0})`}:</label>
                            {product.images ? (
                                <ul>
                                    {product.images.map(image => {
                                        return (
                                            <li key={`BARK-${image}`}>
                                                <img src={image} alt="Uploaded image" width={100} height={80} />
                                                <button type="button" onClick={() => onDeleteImages(image)}>
                                                    Delete image
                                                </button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            ) : (
                                <p>This product don't have additional pictures</p>
                            )}
                        </div>
                    </div>
                </section>
                
                {/* WEIGHT */}
                <section className="form-section">
                    <div className="form-group">
                        <label htmlFor="pr-weight">Weight:</label>
                        <input
                            type="text"
                            id="pr-weight"
                            required
                            placeholder="1.33"
                            value={product.weight}
                            onChange={onWeightChange}
                        />
                        {undoButton("weight")}
                        {fieldErrors.weight && (
                            <div>
                                fieldError("weight")
                                <p>Behind dot should be not more than 2 numbers</p>
                            </div>
                        )}
                    </div>
                </section>
                
                {/* WEIGHT */}
                <section className="form-section">
                    <div className="form-group">
                        <label htmlFor="pr-unit">Unit:</label>
                        <select value={product.unit} onChange={onUnitChange}>
                            <option value="kg">
                                kg
                            </option>
                            <option value="liter">
                                liter
                            </option>
                            <option value="piece">
                                piece
                            </option>
                            <option value="pack">
                                pack
                            </option>
                        </select>
                        {undoButton("unit")}
                        {fieldErrors.unit && fieldError("unit")}
                    </div>
                </section>

                <div className="form-group">
                    <label>Created at:</label>
                    <p>{product.created_at}</p>

                    <label>Updated at:</label>
                    <p>{product.updated_at}</p>
                </div>

                <div className="form-group">
                    <div className="button-group">
                        <button type="submit" disabled={loading}>
                            {action === "update" ? "Save Changes" : "Create Product"}
                        </button>
                        <button type="button" onClick={() => onUndoClick(undefined)} disabled={loading}>
                            Undo Changes
                        </button>
                        {action === "update" && (
                            <button type="button" onClick={handleDeleteClick} disabled={loading}>
                                Delete Product
                            </button>
                        )}
                    </div>
                </div>

            </form>

        </div>
    );
}