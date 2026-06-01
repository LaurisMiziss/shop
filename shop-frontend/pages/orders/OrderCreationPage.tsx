import "./OrderCreationPage.css";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import type { Cart } from "../../types/cart";
import type { ProductDetail } from "../../types/products";
import { deleteCartItemsApi } from "../../api/cartItems/deleteCartItemsApi";
import { useAuth } from "../../context/AuthContext";
import { useSearch } from "../../context/SearchContext";
import { useOrderCreation } from "../../hooks/orders/useOrderCreation";
import { useProductList } from "../../hooks/products/useProductList";
import { OrderCreationForm } from "../../components/order/OrderCreation";
import { CartItemList } from "../../components/order/CartItemList";
import { Navbar } from "../../components/general/Navbar";

export default function OrderCreationPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const cart = location.state?.cart as Cart[] | null;
    const { 
        shippingName,
        shippingPhone,
        shippingAddressLine1,
        shippingAddressLine2,
        shippingCity,
        shippingPostalCode,
        shippingCountry,
        paymentMethod,
        customerNotes,
        alert,
        loading,
        phoneError,
        onShippingNameChange,
        onShippingPhoneChange,
        onShippingAddressLineChange,
        onShippingCityChange,
        onShippingPostalCodeChange,
        onShippingCountryChange,
        onPaymentMethodChange,
        onCustomerNotesChange,
        postOrder,
        removeAlert
    } = useOrderCreation();
    const { user } = useAuth();
    const { searchQuery, clearSearch } = useSearch();
    const { getProductDetails } = useProductList();

    useEffect(() => {
        if (!user) {
            navigate("login");
        }            
    }, []);

    const handleSearchClick = async () => {
        navigate("/shop-products", { state: { query: searchQuery }});
        clearSearch();
    };

    const handleProductClick = async (productId: number) => {
        const product = await getProductDetails(productId);
        onNavigateToProductDetails(product);
        clearSearch();
    };

    const onNavigateToCart = () => navigate("/cart-items", { state: { orderCart: cart }});
    const onNavigateToProductDetails = (product: ProductDetail | null) => navigate("/shop-products-details", {state: { product: product }});

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const res = await postOrder(cart);

        if (res && cart) {
            await deleteCartItemsApi(cart);
            navigate("/orders-post-finish", { state: { orderId: res }});
        }
    };

    return (
        <div className="checkout-page">

            <Navbar
                onSearchClick={handleSearchClick}
                onProductClick={handleProductClick}
            />

            <div className="checkout-content">

                <button
                    type="button"
                    className="back-button"
                    onClick={onNavigateToCart}
                >
                    ← Return to the cart
                </button>

                <div className="checkout-main">

                <button
                    type="button"
                    className="back-button"
                    onClick={onNavigateToCart}
                >
                    ← Return to the cart
                </button>

                    <div className="checkout-form">

                        <OrderCreationForm
                            user={user}
                            shippingName={shippingName}
                            shippingPhone={shippingPhone}
                            shippingAddressLine1={shippingAddressLine1}
                            shippingAddressLine2={shippingAddressLine2}
                            shippingCity={shippingCity}
                            shippingPostalCode={shippingPostalCode}
                            shippingCountry={shippingCountry}
                            paymentMethod={paymentMethod}
                            customerNotes={customerNotes}
                            alert={alert}
                            loading={loading}
                            phoneError={phoneError}
                            onShippingNameChange={onShippingNameChange}
                            onShippingPhoneChange={onShippingPhoneChange}
                            onShippingAddressLineChange={onShippingAddressLineChange}
                            onShippingCityChange={onShippingCityChange}
                            onShippingPostalCodeChange={onShippingPostalCodeChange}
                            onShippingCountryChange={onShippingCountryChange}
                            onPaymentMethodChange={onPaymentMethodChange}
                            onCustomerNotesChange={onCustomerNotesChange}
                            onSubmit={onSubmit}
                            onNavigateToLogin={() => navigate("/login")}
                            removeAlert={removeAlert}
                        />

                    </div>

                    <div className="checkout-cart">

                        <CartItemList cart={cart} />

                    </div>

                </div>

            </div>

        </div>
    );
}