import { useNavigate } from "react-router-dom";
import type { Category } from "../../../types/category";
import { useSearch } from "../../../context/SearchContext";
import { useAdminCategoryList } from "../../../hooks/admin/categories/useAdminCategoryList";
import { useAdminProductList } from "../../../hooks/admin/products/useAdminProductList";
import { Navbar } from "../../../components/general/Navbar";
import { CategoryList } from "../../../components/admin/category/CategoryList";
import { CreateButton } from "../../../components/admin/createButton/CreateButton";

export default function AdminCategoryListPage() {
    const navigate = useNavigate();
    const { searchQuery, saveQuery, clearSearch } = useSearch();
    const { categories, view, loading, alert, getCategoryDetails, onViewChange, removeAlert } = useAdminCategoryList();
    const { getProductDetails, getAdminProductsWithFilters } = useAdminProductList();

    const onCategoryClick = async (categoryId: number | null, action: "update" | "create") => {
        if (!categoryId && action === "create") return onNavigateToCategoryDetails(null, action);
        
        const category = categoryId && await getCategoryDetails(categoryId);

        if (!category) return;

        onNavigateToCategoryDetails(category, action);
    };

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
    const onNavigateToCategoryDetails = (category: Category | null, action: "update" | "create") => {
        navigate("/admin-panel-edit-category", {state: { category: category, action: action }});
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
            
            <CategoryList
                categories={categories}
                view={view}
                loading={loading}
                alert={alert}
                onCategoryClick={onCategoryClick}
                onViewChange={onViewChange}
                removeAlert={removeAlert}
            />

            <CreateButton
                name={"category"}
                onNavigateToCreationPage={() => onCategoryClick(0, "create")}
            />

        </div>
    );
}