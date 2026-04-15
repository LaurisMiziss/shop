import { useNavigate, useLocation } from "react-router-dom";
import type { Cart } from "../../types/cart";
import { useProductList } from "../../hooks/products/useProductList";
import { useCategoryList } from "../../hooks/category/useCategoryList";
import { useSelect } from "../../hooks/orders/useSelect";
import { useCart } from "../../context/CartContext";
import { useSearch } from "../../context/SearchContext";
import { useAuth } from "../../context/AuthContext";
import { Navbar } from "../../components/general/Navbar";
import { CartList } from "../../components/cart/CartList";
import { Filter } from "../../components/cart/Filter";
import { Pagination } from "../../components/general/Pagination";
import { useEffect } from "react";

export default function CartPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const orderCart = location.state?.orderCart as Cart[] | null;
    const { 
        cart, name, selected, filter, loading, alert, currentPage, totalPages, updateItem, deleteItem, onNameChange, updateSelected,
        onFilterPriceChange, onCategoryChange, onSortChange, onSortTypeChange, onIsFeaturedChange, removeAlert, onPageChange
    } = useCart();
    const { getProductDetails, getProductsWithFilters } = useProductList();
    const { categories } = useCategoryList();
    const { searchQuery, saveQuery, clearSearch } = useSearch();
    const { isAuthenticated } = useAuth();
    const { selectedItems, selectItem, loadOrderCart } = useSelect();

    useEffect(() => {
        if (!isAuthenticated) navigate("/login", { state: { from: location.pathname }});
        if (orderCart) loadOrderCart(orderCart);
    }, [])

    const onNavigateToHome = () => navigate("/home");
    const onNavigateToShop = () => navigate("/shop-products");
    const onNavigateToCart = () => navigate("/cart-items");
    const onNavigateToOrders = () => navigate("/orders");
    const onNavigateToOrderCreation = () => navigate("/orders-post", { state: { cart: selectedItems }});
    const onNavigateToProfile = () => navigate("/profile");
    const onNavigateToSettings = () => navigate("/settings");
    const onNavigateToProductDetails = async (productId: number) => {
        const product = await getProductDetails(productId)
        navigate("/shop-products-details", {state: { product: product }});
    };

    const handleSearchClick = async () => {
        saveQuery();
        await getProductsWithFilters(searchQuery);
        onNavigateToShop();
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
                onProductClick={onNavigateToProductDetails}
            />

            <CartList
                cart={cart}
                selectedItems={selectedItems}
                name={name}
                selected={selected}
                loading={loading}
                alert={alert}
                updateSelected={updateSelected}
                onQuantityChange={updateItem}
                onDeleteClick={deleteItem}
                onNavigateToShop={onNavigateToShop}
                onNavigateToProductDetails={onNavigateToProductDetails}
                removeAlert={removeAlert}
                selectItem={selectItem}
                onNavigateToOrderCreation={onNavigateToOrderCreation}
            />

            <Filter
                name={name}
                categories={categories}
                filter={filter}
                onNameChange={onNameChange}
                onFilterPriceChange={onFilterPriceChange}
                onCategoryChange={onCategoryChange}
                onSortChange={onSortChange}
                onSortTypeChange={onSortTypeChange}
                onIsFeaturedChange={onIsFeaturedChange}
            />

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
            />
        </div>
    );
}