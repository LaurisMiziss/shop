import { useNavigate } from "react-router-dom";
import { useSearch } from "../../../context/SearchContext";
import { useProductList } from "../../../hooks/products/useProductList";
import { Navbar } from "../../../components/general/Navbar";
import { ProductList } from "../../../components/admin/product/ProductList";
import { Pagination } from "../../../components/general/Pagination";

export default function ProductListPage() {
    const navigate = useNavigate();
    const { searchQuery, saveQuery, clearSearch } = useSearch();
    const {
        products, view, loading, alert, query, onQueryChange, currentPage, totalPages, 
        getProductDetails, getProductsWithFilters, onViewChange, onPageChange, removeAlert
    } = useProductList();

    const onNavigateToProductDetails = async (productId: number | null) => {
        const product = productId ? await getProductDetails(productId) : null;
        navigate("/shop-products-details", {state: { product: product }});
    };

    const onNavigateToEditProduct = async (productId: number | null, action: string) => {
        const product = productId ? await getProductDetails(productId) : null;
        navigate("/admin-panel-edit-product", {state: { product: product, action: action }});
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

                <ProductList
                    products={products}
                    loading={loading}
                    view={view}
                    query={query}
                    alert={alert}
                    onQueryChange={onQueryChange}
                    onProductClick={onNavigateToEditProduct}
                    removeAlert={removeAlert}
                    onViewChange={onViewChange}
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