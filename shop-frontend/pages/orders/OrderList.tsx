import "./OrderList.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { ProductDetail } from "../../types/products";
import { useSearch } from "../../context/SearchContext";
import { useOrderList } from "../../hooks/orders/useOrderList";
import { useProductList } from "../../hooks/products/useProductList";
import { OrderListTable } from "../../components/order/OrderListTable";
import { Pagination } from "../../components/general/Pagination";
import { Navbar } from "../../components/general/Navbar";

export default function OrderList() {
    const navigate = useNavigate();
    const { searchQuery, clearSearch } = useSearch();
    const { 
        orders, selected, alert, loading, currentPage, totalPages, 
        getOrders, handleEditChange, onNoteChange, onSaveOrUndo, onDeleteOrder, removeAlert, onPageChange 
    } = useOrderList();
    const { getProductDetails } = useProductList();

    useEffect(() => {
        const loadData = async () => {
            await getOrders();
        };
        
        loadData();
    }, []);

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
        <div className="orders-page">

            <Navbar
                onSearchClick={handleSearchClick}
                onProductClick={handleProductClick}
            />

            <div className="orders-content">

                <div className="orders-table-wrapper">

                    <OrderListTable 
                        orders={orders} 
                        selected={selected}
                        alert={alert}
                        loading={loading}
                        handleEditChange={handleEditChange}
                        onNoteChange={onNoteChange}
                        onSaveOrUndo={onSaveOrUndo}
                        onNavigateToProductDetails={handleProductClick}
                        onDeleteOrder={onDeleteOrder}
                        removeAlert={removeAlert}
                    />

                </div>

                <div className="orders-pagination">

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={onPageChange}
                    />

                </div>

            </div>

        </div>
    );
}