import "./OrderFinish.css";
import { useNavigate, useLocation } from "react-router-dom";
import type { ProductDetail } from "../../types/products";
import { useSearch } from "../../context/SearchContext";
import { useProductList } from "../../hooks/products/useProductList";
import { Navbar } from "../../components/general/Navbar";

export default function OrderFinish() {
    const navigate = useNavigate();
    const location = useLocation();
    const orderId = location.state?.orderId as number | null;
    const { getProductDetails } = useProductList();
    const { searchQuery, clearSearch } = useSearch();

    const handleSearchClick = async () => {
        navigate("/shop-products", { state: { query: searchQuery }});
        clearSearch();
    };

    const handleProductClick = async (productId: number) => {
        const product = await getProductDetails(productId);
        onNavigateToProductDetails(product);
        clearSearch();
    };

    const onNavigateToProductDetails = (product: ProductDetail | null) => navigate("/shop-products-details", {state: { product: product }});

    return (
        <div className="order-page-layout">
            <Navbar
                onSearchClick={handleSearchClick}
                onProductClick={handleProductClick}
            />

            <div className="order-success-container">

                <div className="order-success-card fade-in">

                    <div className="order-success-icon">✓</div>

                    <h2>Order placed successfully!</h2>

                    <p className="order-success-text">
                        Thank you for your purchase. Your order has been received.
                    </p>

                    {orderId && (
                        <p className="order-success-id">
                            Order ID: <strong>{orderId}</strong>
                        </p>
                    )}
                    <div className="finish-buttons">

                        <button
                            className="order-success-button"
                            onClick={() => navigate("/home")}
                        >
                            Back to Home
                        </button>

                        <button
                            className="visit-orders-button"
                            onClick={() => navigate("/orders")}
                        >
                            Check your orders
                        </button>

                    </div>

                </div>

            </div>
        </div>
    );

}