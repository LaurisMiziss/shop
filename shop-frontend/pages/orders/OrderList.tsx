import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../../context/SearchContext";
import { useOrderList } from "../../hooks/orders/useOrderList";
import { useProductList } from "../../hooks/products/useProductList";
import { OrderListTable } from "../../components/order/OrderListTable";
import { Pagination } from "../../components/general/Pagination";
import { Navbar } from "../../components/general/Navbar";

export default function OrderList() {
    const navigate = useNavigate();
    const { searchQuery, saveQuery, clearSearch } = useSearch();
    const { 
        orders, selected, alert, currentPage, totalPages, 
        getOrders, handleEditChange, onNoteChange, onSaveOrUndo, onDeleteOrder, removeAlert, onPageChange 
    } = useOrderList();
    const { getProductDetails, getProductsWithFilters } = useProductList();

    useEffect(() => {
        const loadData = async () => {
            await getOrders();
        };
        
        loadData();
    }, []);

    const onNavigateToHome = () => navigate("/home");
    const onNavigateToShop = () => navigate("/shop-products");
    const onNavigateToCart = () => navigate("/cart-items");
    const onNavigateToOrders = () => navigate("/orders");
    const onNavigateToProfile = () => navigate("/profile");
    const onNavigateToSettings = () => navigate("/settings");
    const onNavigateToProductDetails = async (productId: number) => {
        const product = await getProductDetails(productId);
        navigate("/shop-products-details", {state: { product: product }});
    }
    const onNavigateToAdminPanel = () => navigate("/admin-panel");

    const handleSearchClick = async () => {
        saveQuery();
        await getProductsWithFilters(searchQuery);
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
                onNavigateToAdminPanel={onNavigateToAdminPanel}
            />

            <OrderListTable 
                orders={orders} 
                selected={selected}
                alert={alert}
                handleEditChange={handleEditChange}
                onNoteChange={onNoteChange}
                onSaveOrUndo={onSaveOrUndo}
                onNavigateToProductDetails={onNavigateToProductDetails}
                onDeleteOrder={onDeleteOrder}
                removeAlert={removeAlert}
                />

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
            />
        </div>
    );
}