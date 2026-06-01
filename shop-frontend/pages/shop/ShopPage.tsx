import "../../components/products/ProductPage.css";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import type { ProductDetail } from "../../types/products";
import { useSearch } from "../../context/SearchContext";
import { useProductList } from "../../hooks/products/useProductList";
import { useCategoryList } from "../../hooks/category/useCategoryList";
import { Navbar } from "../../components/general/Navbar";
import { ProductList } from "../../components/products/ProductList";
import { Filters } from "../../components/general/Filters";
import { Pagination } from "../../components/general/Pagination";

export default function ShopPage() {
    const location = useLocation();
    const passedQuery = location.state?.query as string | null;
    const {
        products,
        view,
        loading,
        alert,
        filter,
        totalPages,
        currentPage,
        totalCount,
        getProductDetails,
        onFilterPriceChange,
        onCategoryChange,
        onSortChange,
        onSortTypeChange,
        onIsFeaturedChange,
        onViewChange,
        removeAlert,
        onPassedQueryChange,
        onPageChange
    } = useProductList();   
    const { categories } = useCategoryList();
    const { searchQuery, clearSearch } = useSearch();
    const navigate = useNavigate();

    useEffect(() => {
        onPassedQueryChange(passedQuery);
    }, [passedQuery]);

    const onNavigateToProductDetails = (product: ProductDetail | null) => navigate("/shop-products-details", {state: { product: product }});

    const handleSearchClick = async () => {
        navigate("/shop-products", { state: { query: searchQuery }});
        clearSearch();
    };

    const handleProductClick = async (productId: number) => {
        const product = await getProductDetails(productId);
        onNavigateToProductDetails(product);
        clearSearch();
    };

    return (
        <div className="shop-page-layout">

            <Navbar
                onSearchClick={handleSearchClick}
                onProductClick={handleProductClick}
            />

            <div className="shop-page-content">

                <div className="shop-main">

                    <Filters
                        filter={filter}
                        view={view}
                        categories={categories}
                        onFilterPriceChange={onFilterPriceChange}
                        onCategoryChange={onCategoryChange}
                        onViewChange={onViewChange}
                        onSortChange={onSortChange}
                        onSortTypeChange={onSortTypeChange}
                        onIsFeaturedChange={onIsFeaturedChange}
                    />

                    <ProductList
                        products={products}
                        loading={loading}
                        passedQuery={passedQuery}
                        totalCount={totalCount}
                        view={view}
                        alert={alert}
                        onProductClick={handleProductClick}
                        removeAlert={removeAlert}
                    />

                </div>

            </div>
            
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={onPageChange}
                />

        </div>
    );
}