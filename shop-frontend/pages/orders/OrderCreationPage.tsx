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
    const cart = location.state?.cart as Cart[] | null;
    const { user } = useAuth();
    const { searchQuery, saveQuery, clearSearch } = useSearch();
    const { getProductsWithFilters, getProductDetails } = useProductList();

    useEffect(() => {
        if (user) {
            onShippingNameChange(user.full_name);
            onShippingPhoneChange(user.phone);
            onShippingAddressLineChange(1, user.address_line1)
            onShippingAddressLineChange(2, user.address_line2);
            onShippingCityChange(user.city);
            onShippingPostalCodeChange(user.postal_code);
            onShippingCountryChange(user.country);
        } else {
            onNavigateToLogin();
        }
    }, []);

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

    const onNavigateToLogin = () => navigate("/login", { state: { from: location.pathname }});
    const onNavigateToHome = () => navigate("/home");
    const onNavigateToShop = () => navigate("/shop-products");
    const onNavigateToCart = () => navigate("/cart-items", { state: { orderCart: cart }});
    const onNavigateToOrders = () => navigate("/orders");
    const onNavigateToProfile = () => navigate("/profile");
    const onNavigateToSettings = () => navigate("/settings");
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

            <button type="button" onClick={onNavigateToCart}>
                ← Return to the cart
            </button>

            <OrderCreationForm
                user={user && user}
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
                onNavigateToLogin={onNavigateToLogin}
                removeAlert={removeAlert}
            />

            <CartItemList cart={cart} />

        </div>
    );
}