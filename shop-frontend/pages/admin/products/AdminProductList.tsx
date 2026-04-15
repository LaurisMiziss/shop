import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../../../context/SearchContext";
import { useAdminProductList } from "../../../hooks/admin/products/useAdminProductList";
import { Navbar } from "../../../components/general/Navbar";
import { ProductList } from "../../../components/products/ProductList";
import { Pagination } from "../../../components/general/Pagination";

export default function AdminProductList() {
    const navigate = useNavigate();
    const { searchQuery, savedQuery, saveQuery, clearSearch } = useSearch();
    const {
        products, tableView, filter, loading, alert, currentPage, totalPages, 
        getProductDetails, getAdminProductsWithFilters, onViewChange, onPageChange
    } = useAdminProductList();
    
    useEffect(() => {
        const fetchData = async () => getAdminProductsWithFilters(savedQuery);

        fetchData();
    }, [currentPage, totalPages, filter]);

    const onNavigateToHome = () => navigate("/home");
    const onNavigateToShop = () => navigate("/admin-panel");
    const onNavigateToCart = () => navigate("/cart-items");
    const onNavigateToOrders = () => navigate("/orders");
    const onNavigateToProfile = () => navigate("/profile");
    const onNavigateToSettings = () => navigate("/settings");
    const onNavigateToProductDetails = async (productId: number | null, action: string) => {
        const product = productId ? await getProductDetails(productId) : null;
        navigate("/admin-panel-edit-product", {state: { product: product, action: action }});
    };

    const handleSearchClick = async () => {
        saveQuery();
        await getAdminProductsWithFilters(searchQuery);
        onNavigateToShop();
        clearSearch();
    };

    const handleProductClick = async (productId: number) => {
        onNavigateToProductDetails(productId, "update");
        clearSearch();
    };

    const handlePostProductClick = async () => {
        onNavigateToProductDetails(null, "create");
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

            <ProductList
                products={products}
                onProductClick={onNavigateToProductDetails}
                loading={loading}
                error={null}
                tableView={tableView}
                onViewChange={onViewChange}
            />

            <div>
                <button type="button" onClick={handlePostProductClick}>
                    Create A New Product
                </button>
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
            />
            
        </div>
    );
}