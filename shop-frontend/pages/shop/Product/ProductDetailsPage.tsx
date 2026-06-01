import "../../../components/products/ProductPage.css";
import { useLocation, useNavigate } from "react-router-dom";
import type { ProductDetail } from "../../../types/products";
import { useSearch } from "../../../context/SearchContext";
import { useAuth } from "../../../context/AuthContext";
import { useCart } from "../../../context/CartContext"
import { useProductList } from "../../../hooks/products/useProductList";
import { useProductDetails } from "../../../hooks/products/useProductDetails";
import { ProductDetails } from "../../../components/products/ProductDetails";
import { Navbar } from "../../../components/general/Navbar";

export default function ProductDetailsPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const product = location.state?.product as ProductDetail | null;
    const { searchQuery, clearSearch } = useSearch();
    const { isAuthenticated } = useAuth();
    const { cart, getCartItems } = useCart();
    const { getProductDetails, getProductsWithFilters } = useProductList();
    const { quantity, loading, alert, onQuantityChange, removeAlert, onAddToCart } = useProductDetails();
    
    const onNavigateToProductDetails = (product: ProductDetail | null) => navigate("/shop-products-details", {state: { product: product }});

    const handleSearchClick = async () => {
        navigate("/shop-products", { state: { query: searchQuery }});
        clearSearch();
    };

    const handleProductClick = async (productId: number) => {
        const product = await getProductDetails(productId);
        onNavigateToProductDetails(product);
        clearSearch()
    };

    const handleAddToCart = async () => {
        if (!isAuthenticated) return navigate("/login", { state: { from: location.pathname } });

        if (!product) return;
        
        await onAddToCart(product.id, quantity, product.unit);

        getCartItems();
    };

    return (
        <div className="shop-page-layout">

            <Navbar
                onSearchClick={handleSearchClick}
                onProductClick={handleProductClick}
            />

            <div className="shop-page-content product">

                <div className="shop-main">

                    <ProductDetails
                        product={product}
                        cart={cart}
                        quantity={quantity}
                        loading={loading}
                        alert={alert}
                        onQuantityChange={onQuantityChange}
                        handleAddToCart={handleAddToCart}
                        removeAlert={removeAlert}
                    />

                </div>

            </div>

        </div>
    );
}