import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { ProductDetail } from "../../../types/products";
import { useSearch } from "../../../context/SearchContext";
import { useAdminProductList } from "../../../hooks/admin/products/useAdminProductList";
import { useProductDetails } from "../../../hooks/admin/products/useProductDetails";
import { useCategoryList } from "../../../hooks/category/useCategoryList";
import { ProductDetails } from "../../../components/admin/productDetail/ProductDetails";
import { Navbar } from "../../../components/general/Navbar";

export default function AdminEditProduct() {
    const navigate = useNavigate();
    const location = useLocation();
    const passedAction = location.state?.action as "create" | "update" | null;
    const passedProduct = location.state?.product as ProductDetail | null;
    const { searchQuery, saveQuery, clearSearch } = useSearch();
    const { getProductDetails, getAdminProductsWithFilters } = useAdminProductList();
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
    
    const onNavigateToHome = () => navigate("/home");
    const onNavigateToShop = () => navigate("/admin-panel");
    const onNavigateToCart = () => navigate("/cart-items");
    const onNavigateToOrders = () => navigate("/orders");
    const onNavigateToProfile = () => navigate("/profile");
    const onNavigateToSettings = () => navigate("/settings");
    const onNavigateToProductDetails = async (productId: number) => {
        const product = await getProductDetails(productId)
        navigate("/admin-panel-edit-product", {state: { product: product }});
    };
    const onNavigateToProductList = () => navigate("admin-panel-product-list");

    const handleDeleteClick = async () => {
        const res = await deleteProduct();

        if (res) onNavigateToProductList();
    };

    const handleSearchClick = async () => {
        saveQuery();
        await getAdminProductsWithFilters(searchQuery);
        onNavigateToShop();
        clearSearch();
    };

    const handleProductClick = async (productId: number) => {
        onNavigateToProductDetails(productId);
        clearSearch();
    };

    return (
        <div>

            <Navbar
                onNavigateToHome={onNavigateToHome}
                onNavigateToShop={onNavigateToShop}
                onNavigateToCart={onNavigateToCart}
                onNavigateToOrders={onNavigateToOrders}
                onNavigateToProfile={onNavigateToProfile}
                onNavigateToSettings={onNavigateToSettings}
                onSearchClick={handleSearchClick}
                onProductClick={handleProductClick}
                onNavigateToAdminPanel={onNavigateToShop}
            />


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
    );
}