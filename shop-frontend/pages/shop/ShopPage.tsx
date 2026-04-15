import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { ProductDetail } from "../../types/products";
import { useSearch } from "../../context/SearchContext";
import { useProductList } from "../../hooks/products/useProductList";
import { useCategoryList } from "../../hooks/category/useCategoryList";
import { Navbar } from "../../components/general/Navbar";
import { SearchQuery } from "../../components/general/SearchQuery";
import { ProductList } from "../../components/products/ProductList";
import { Filters } from "../../components/general/Filters";
import { Pagination } from "../../components/general/Pagination";

export default function ShopPage() {
    const {
        products,
        loading,
        error,
        filter,
        totalPages,
        currentPage,
        totalCount,
        getProductDetails,
        getProductsWithFilters,
        onFilterPriceChange,
        onCategoryChange,
        onSortChange,
        onSortTypeChange,
        onIsFeaturedChange,
        onPageChange
    } = useProductList();   
    const { categories } = useCategoryList();
    const { searchQuery, savedQuery, saveQuery, clearSearch } = useSearch();
    const navigate = useNavigate();

    useEffect(() => {
        const getProducts = async () => await getProductsWithFilters(savedQuery);
        getProducts();
    }, [currentPage, totalPages]);
    
    const onNavigateToHome = () => navigate("/home");
    const onNavigateToShop = () => navigate("/shop-products");
    const onNavigateToCart = () => navigate("/cart");
    const onNavigateToOrders = () => navigate("/orders");
    const onNavigateToProfile = () => navigate("/profile");
    const onNavigateToSettings = () => navigate("/settings");
    const onNavigateToProductDetails = (product: ProductDetail | null) => navigate("/shop-products-details", {state: { product: product }});

    const handleSearchClick = async () => {
        saveQuery();
        await getProductsWithFilters(searchQuery);
        onNavigateToShop();
        clearSearch();
    };

    const handleProductClick = async (productId: number) => {
        const product = await getProductDetails(productId);
        onNavigateToProductDetails(product);
        clearSearch();
    };

    return (
        <div className="shop-page">

            <Navbar
                onNavigateToHome={onNavigateToHome}
                onNavigateToShop={onNavigateToShop}
                onNavigateToCart={onNavigateToCart}
                onNavigateToOrders={onNavigateToOrders}
                onNavigateToProfile={onNavigateToProfile}
                onNavigateToSettings={onNavigateToSettings}
                onSearchClick={handleSearchClick}
                onProductClick={handleProductClick}
            />

            <SearchQuery
                totalCount={totalCount}
                savedQuery={savedQuery}
            />

            <Filters
                filter={filter}
                categories={categories}
                onFilterPriceChange={onFilterPriceChange}
                onCategoryChange={onCategoryChange}
                onSortChange={onSortChange}
                onSortTypeChange={onSortTypeChange}
                onIsFeaturedChange={onIsFeaturedChange}
            />

            <ProductList
                products={products}
                loading={loading}
                error={error}
                onProductClick={handleProductClick}
            />

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
            />

        </div>
    );
}