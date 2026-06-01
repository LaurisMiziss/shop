import "../../../components/admin/general/PageList.css";
import { useNavigate } from "react-router-dom";
import type { Category } from "../../../types/category";
import { useSearch } from "../../../context/SearchContext";
import { useCategoryList } from "../../../hooks/admin/categories/useCategoryList";
import { useProductList } from "../../../hooks/products/useProductList";
import { Navbar } from "../../../components/general/Navbar";
import { CategoryList } from "../../../components/admin/category/CategoryList";
import { Pagination } from "../../../components/general/Pagination";

export default function CategoryListPage() {
    const navigate = useNavigate();
    const { searchQuery, saveQuery, clearSearch } = useSearch();
    const { 
        categories,view, loading, alert, currentPage, totalPages, query, onQueryChange,
        getCategoryDetails, onViewChange, removeAlert, onPageChange
    } = useCategoryList();
    const { getProductDetails, getProductsWithFilters } = useProductList();

    const onCategoryClick = async (categoryId: number | null, action: "update" | "create") => {
        if (!categoryId && action === "create") return onNavigateToCategoryDetails(null, action);
        
        const category = categoryId && await getCategoryDetails(categoryId);

        if (!category) return;

        onNavigateToCategoryDetails(category, action);
    };

    const onNavigateToProductDetails = async (productId: number | null) => {
        const product = productId ? await getProductDetails(productId) : null;
        navigate("/shop-products-details", {state: { product: product }});
    };
    const onNavigateToCategoryDetails = (category: Category | null, action: "update" | "create") => {
        navigate("/admin-panel-edit-category", {state: { category: category, action: action }});
    };

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
            
                <CategoryList
                    categories={categories}
                    view={view}
                    loading={loading}
                    alert={alert}
                    query={query}
                    onQueryChange={onQueryChange}
                    onCategoryClick={onCategoryClick}
                    onViewChange={onViewChange}
                    removeAlert={removeAlert}
                />

                {!loading && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={onPageChange}
                    />
                )}

            </div>

        </div>
    );
}