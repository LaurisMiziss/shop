import "../../components/products/ProductPage.css";
import { useNavigate, useLocation } from "react-router-dom";
import type { Cart } from "../../types/cart";
import type { ProductDetail } from "../../types/products";
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
        cart, name, selected, filter, loading, alert, view, onViewChange, currentPage, totalPages, updateItem, deleteItem, onNameChange, updateSelected,
        onFilterPriceChange, onCategoryChange, onSortChange, onSortTypeChange, onIsFeaturedChange, removeAlert, onPageChange, resetFilter
    } = useCart();
    const { getProductDetails } = useProductList();
    const { categories } = useCategoryList();
    const { searchQuery, clearSearch } = useSearch();
    const { isAuthenticated } = useAuth();
    const { selectedItems, selectItem, loadOrderCart, refreshSelectedItems } = useSelect();

    useEffect(() => {
        if (!isAuthenticated) navigate("/login", { state: { from: location.pathname }});
        resetFilter();
        if (orderCart) loadOrderCart(orderCart);
    }, [])

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

    const handlePayButtonClick = () => {
        if (!selectedItems) return;
        navigate("/orders-post", { state: { cart: selectedItems }});
    };

    const handleRemoveButtonClick = () => {
        if (!selectedItems) return;

        const removeItems = confirm("Are you sure want to remove selected items from your cart?");

        if (removeItems) {
            selectedItems.map(async (item) => {
                deleteItem(item.product_id);
            });

            refreshSelectedItems();
        };
    };

    return (
        <div className="shop-page-layout">

            <Navbar
                onSearchClick={handleSearchClick}
                onProductClick={handleProductClick}
            />

            
            <div className="shop-page-content">

                <div className="shop-main">

                    <Filter
                        name={name}
                        categories={categories}
                        filter={filter}
                        view={view}
                        onNameChange={onNameChange}
                        onViewChange={onViewChange}
                        onFilterPriceChange={onFilterPriceChange}
                        onCategoryChange={onCategoryChange}
                        onSortChange={onSortChange}
                        onSortTypeChange={onSortTypeChange}
                        onIsFeaturedChange={onIsFeaturedChange}
                    />

                    <CartList
                        cart={cart}
                        selectedItems={selectedItems}
                        selected={selected}
                        loading={loading}
                        alert={alert}
                        view={view}
                        updateSelected={updateSelected}
                        onQuantityChange={updateItem}
                        onDeleteClick={deleteItem}
                        onNavigateToShop={() => navigate("/shop-products")}
                        onNavigateToProductDetails={handleProductClick}
                        removeAlert={removeAlert}
                        selectItem={selectItem}
                        onNavigateToOrderCreation={handlePayButtonClick}
                        onRemoveSelectedCartItems={handleRemoveButtonClick}
                    />

                </div>

            </div>

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={onPageChange}
                />

        </div>
    );
}