import "../../../components/admin/general/PageList.css";
import { useNavigate } from "react-router-dom";
import type { Order } from "../../../types/order";
import { useSearch } from "../../../context/SearchContext";
import { useOrderList } from "../../../hooks/admin/orders/useOrderList";
import { useProductList } from "../../../hooks/products/useProductList";
import { Navbar } from "../../../components/general/Navbar";
import { OrderList } from "../../../components/admin/order/OrderList";
import { Pagination } from "../../../components/general/Pagination";

export default function OrderListPage() {
    const navigate = useNavigate();
    const { searchQuery, saveQuery, clearSearch } = useSearch();
    const {
        orders,
        query,
        view,
        loading,
        alert,
        currentPage,
        totalPages,
        getOrderDetails,
        onQueryChange,
        onViewChange,
        removeAlert,
        onPageChange
    } = useOrderList();
    const { getProductDetails, getProductsWithFilters } = useProductList();

    const onOrderClick = async (orderId: number) => {
        const res = await getOrderDetails(orderId);
        if (res) return onNavigateToEditOrder(res);
    };

    const onNavigateToProductDetails = async (productId: number | null) => {
        const product = productId ? await getProductDetails(productId) : null;
        navigate("/shop-products-details", {state: { product: product }});
    };
    const onNavigateToEditOrder = (order: Order) => navigate("/admin-panel-edit-order", { state: { order: order }});

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

                <OrderList
                    orders={orders}
                    view={view}
                    loading={loading}
                    alert={alert}
                    query={query}
                    onQueryChange={onQueryChange}
                    onViewChange={onViewChange}
                    removeAlert={removeAlert}
                    onOrderClick={onOrderClick}
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