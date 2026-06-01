import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import type { Order } from "../../../types/order";
import { useSearch } from "../../../context/SearchContext";
import { useOrderDetails } from "../../../hooks/admin/orders/useOrderDetails";
import { useProductList } from "../../../hooks/products/useProductList";
import { Navbar } from "../../../components/general/Navbar";
import { OrderDetails } from "../../../components/admin/order/OrderDetails";
import { ReturnButton } from "../../../components/general/ReturnButton";

export default function OrderDetailsPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const passedOrder = location.state?.order as Order | null;
    const { searchQuery, saveQuery, clearSearch } = useSearch();
    const {
        oldOrder,
        order,
        loading,
        alert,
        handleOrderChange,
        onUndoClick,
        onUpdateOrderClick,
        onNotesChange,
        onOrderStatusChange,
        onPaymentStatusChange,
        removeAlert
    } = useOrderDetails();
    const { getProductDetails, getProductsWithFilters } = useProductList();

    useEffect(() => {
        handleOrderChange(passedOrder);
    }, []);

    const onNavigateToProductDetails = async (productId: number | null, action: string) => {
        const product = productId ? await getProductDetails(productId) : null;
        navigate("/admin-panel-edit-product", {state: { product: product, action: action }});
    };

    const onNavigateToOrderList = () => navigate("/admin-panel-order-list");

    const handleSearchClick = async () => {
        saveQuery();
        await getProductsWithFilters(searchQuery);
        navigate("/shop-products");
        clearSearch();
    };

    const handleProductClick = async (productId: number) => {
        onNavigateToProductDetails(productId, "update");
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

                    <ReturnButton onNavigateBack={onNavigateToOrderList} />

                    <OrderDetails
                        oldOrder={oldOrder}
                        order={order}
                        loading={loading}
                        alert={alert}
                        onUndoClick={onUndoClick}
                        onUpdateOrderClick={onUpdateOrderClick}
                        onNotesChange={onNotesChange}
                        onOrderStatusChange={onOrderStatusChange}
                        onPaymentStatusChange={onPaymentStatusChange}
                        removeAlert={removeAlert}
                        onNavigateToProductDetails={onNavigateToProductDetails}
                    />

                </div>

            </div>
                
        </div>
    );
}