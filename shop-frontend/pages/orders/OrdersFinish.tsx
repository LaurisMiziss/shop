import "./OrderFinish.css";
import { useNavigate, useLocation } from "react-router-dom";
import type { ProductDetail } from "../../types/products";
import { useSearch } from "../../context/SearchContext";
import { useProductList } from "../../hooks/products/useProductList";
import { Navbar } from "../../components/general/Navbar";

export default function OrderFinish() {
    const navigate = useNavigate();
    const location = useLocation();
    const { getProductsWithFilters, getProductDetails } = useProductList();
    const { searchQuery, saveQuery, clearSearch } = useSearch();
    const orderId = location.state?.orderId as number | null;

    const handleSearchClick = async () => {
        saveQuery();
        await getProductsWithFilters(searchQuery);
        onNavigateToShop();
        clearSearch();
    };

    const handleProductClick = async (productId: number) => {
        const product = await getProductDetails(productId);
        onNavigateToProductDetails(product);
        clearSearch()
    };

    const onNavigateToHome = () => navigate("/home");
    const onNavigateToShop = () => navigate("/shop-products");
    const onNavigateToCart = () => navigate("/cart-items");
    const onNavigateToOrders = () => navigate("/orders");
    const onNavigateToProfile = () => navigate("/profile");
    const onNavigateToSettings = () => navigate("/settings");
    const onNavigateToProductDetails = (product: ProductDetail | null) => navigate("/shop-products-details", {state: { product: product }});

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
                            onClick={onNavigateToHome}
                        >
                            Back to Home
                        </button>

                        <button
                            className="visit-orders-button"
                            onClick={onNavigateToOrders}
                        >
                            Check your orders
                        </button>

                    </div>

                </div>

            </div>
        </div>
    );

}