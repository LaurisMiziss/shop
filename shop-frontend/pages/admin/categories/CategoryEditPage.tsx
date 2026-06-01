import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import type { Category } from "../../../types/category";
import { useSearch } from "../../../context/SearchContext";
import { useProductList } from "../../../hooks/products/useProductList";
import { useCategoryDetails } from "../../../hooks/admin/categories/useCategoryDetails";
import { CategoryDetails } from "../../../components/admin/category/CategoryDetails";
import { Navbar } from "../../../components/general/Navbar";
import { ReturnButton } from "../../../components/general/ReturnButton";

export default function AdminCategoryEditPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { searchQuery ,saveQuery, clearSearch } = useSearch();
    const { getProductsWithFilters, getProductDetails } = useProductList();
    const passedCategory = location.state?.category as Category | null;
    const passedAction = location.state?.action as "update" | "create" | null;
    const {
        oldCategory,
        category,
        imageUrl,
        alert,
        fieldErrors,
        loading,
        postCategory,
        updateCategory,
        deleteCategory,
        onNameChange,
        onDescChange,
        onImageUrlChange,
        onOrderChange,
        onIsActiveChange,
        handleCategoryChange,
        onUndoClick,
        removeAlert
    } = useCategoryDetails();

    useEffect(() => {
        handleCategoryChange(passedCategory, passedAction);
    }, []);

    const onDeleteClick = async () => {
        const res = await deleteCategory();

        if (res) onNavigateToCategoryList();
    };

    const onNavigateToProductDetails = async (productId: number) => {
        const product = await getProductDetails(productId)
        navigate("/admin-panel-edit-product", {state: { product: product, action: "update" }});
    };
    const onNavigateToCategoryList = () => navigate("/admin-panel-category-list");

    const handleSearchClick = async () => {
        saveQuery();
        await getProductsWithFilters(searchQuery);
        navigate("/shop-products");
        clearSearch();
    };

    const handleProductClick = async (productId: number) => {
        console.log(productId)
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

                    <ReturnButton onNavigateBack={onNavigateToCategoryList} />
                
                    <CategoryDetails
                        action={passedAction}
                        oldCategory={oldCategory}
                        category={category}
                        imageUrl={imageUrl}
                        alert={alert}
                        fieldErrors={fieldErrors}
                        loading={loading}
                        removeAlert={removeAlert}
                        postCategory={postCategory}
                        updateCategory={updateCategory}
                        onNameChange={onNameChange}
                        onDescChange={onDescChange}
                        onImageUrlChange={onImageUrlChange}
                        onOrderChange={onOrderChange}
                        onIsActiveChange={onIsActiveChange}
                        onUndoClick={onUndoClick}
                        onDeleteClick={onDeleteClick}
                    />
                    
                </div>

            </div>

        </div>
    );
}