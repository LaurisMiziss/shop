import "../../../components/admin/general/PageDetails.css";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { ProductDetail } from "../../../types/products";
import { useSearch } from "../../../context/SearchContext";
import { useProductList } from "../../../hooks/products/useProductList";
import { useProductDetails } from "../../../hooks/admin/products/useProductDetails";
import { useCategoryList } from "../../../hooks/category/useCategoryList";
import { ProductDetails } from "../../../components/admin/product/ProductDetails";
import { Navbar } from "../../../components/general/Navbar";
import { ReturnButton } from "../../../components/general/ReturnButton";

export default function EditProductPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const passedAction = location.state?.action as "create" | "update" | null;
    const passedProduct = location.state?.product as ProductDetail | null;
    const { searchQuery, saveQuery, clearSearch } = useSearch();
    const { getProductDetails, getProductsWithFilters } = useProductList();
    const {
        oldProduct,
        product,
        imageUrl,
        imagesUrl,
        alert,
        loading,
        fieldErrors,
        onProductChange,
        onNameChange,
        onPriceChange,
        onCategoryChange,
        onStockChange,
        onIsActiveChange,
        onIsFeaturedChange,
        onDescChange,
        onSKUChange,
        onImageUrlChange,
        onImageSave,
        onImagesSave,
        onDeleteImage,
        onDeleteImages,
        onWeightChange,
        onUnitChange,
        onUndoClick,
        removeAlert,
        updateProduct,
        deleteProduct,
        postProduct
    } = useProductDetails();
    const { categories } = useCategoryList();

    useEffect(() => {
        if (passedProduct === null && passedAction === "create") {
            const product = {
                id: 0, name: "", price: "", stock: 0, category_id: 1, image_url: "", is_active: false, is_featured: false, description: "",
                sku: "", images: [], weight: 0, unit: "kg", created_at: "", updated_at: "", total: ""
            };
            onProductChange(product)
        }

        if (passedProduct && passedAction === "update") onProductChange(passedProduct);
    }, []);

    const handleDeleteClick = async () => {
        const res = await deleteProduct();

        if (res) onNavigateToProductList();
    };

    const onNavigateToProductDetails = async (productId: number | null) => {
        const product = productId ? await getProductDetails(productId) : null;
        navigate("/shop-products-details", {state: { product: product }});
    };
    const onNavigateToProductList = () => navigate("/admin-panel-product-list");

    const handleSearchClick = async () => {
        saveQuery();
        await getProductsWithFilters(searchQuery);
        navigate("/shop-products");
        clearSearch();
    };

    const handleProductClick = async (productId: number) => {
        onNavigateToProductDetails(productId);
        clearSearch();
    };
    
    return (
        <div className="page-layout">

            <Navbar
                onSearchClick={handleSearchClick}
                onProductClick={handleProductClick}
            />

            <div className="page-content">

                <div className="details-container">

                    <ReturnButton onNavigateBack={onNavigateToProductList} />

                    <ProductDetails
                        action={passedAction}
                        oldProduct={oldProduct}
                        product={product ? product : null}
                        imageUrl={imageUrl}
                        imagesUrl={imagesUrl}
                        alert={alert}
                        loading={loading}
                        fieldErrors={fieldErrors}
                        categories={categories}
                        onNameChange={onNameChange}
                        onPriceChange={onPriceChange}
                        onStockChange={onStockChange}
                        onCategoryChange={onCategoryChange}
                        onImageUrlChange={onImageUrlChange}
                        onImageSave={onImageSave}
                        onImagesSave={onImagesSave}
                        onDeleteImage={onDeleteImage}
                        onDeleteImages={onDeleteImages}
                        onIsActiveChange={onIsActiveChange}
                        onIsFeaturedChange={onIsFeaturedChange}
                        onDescChange={onDescChange}
                        onSKUChange={onSKUChange}
                        onWeightChange={onWeightChange}
                        onUnitChange={onUnitChange}
                        onUndoClick={onUndoClick}
                        removeAlert={removeAlert}
                        updateProduct={updateProduct}
                        handleDeleteClick={handleDeleteClick}
                        postProduct={postProduct}
                    />

                </div>

            </div>

        </div>
    );
}