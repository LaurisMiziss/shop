import { useLocation, useNavigate } from "react-router-dom";
import type { ProductDetail } from "../../../types/products";
import { useSearch } from "../../../context/SearchContext";
import { useProductList } from "../../../hooks/products/useProductList";
import { ProductDetails } from "../../../components/products/ProductDetails";
import { Navbar } from "../../../components/general/Navbar";

export default function ProductDetailsPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const product = location.state?.product as ProductDetail | null;
    const { searchQuery, saveQuery, clearSearch } = useSearch();
    const { getProductDetails, getProductsWithFilters } = useProductList();
    
    const onNavigateToHome = () => navigate("/home");
    const onNavigateToShop = () => navigate("/shop-products");
    const onNavigateToCart = () => navigate("/cart");
    const onNavigateToOrders = () => navigate("/orders");
    const onNavigateToProfile = () => navigate("/profile");
    const onNavigateToSettings = () => navigate("/settings");
    const onNavigateToProductDetails = (product: ProductDetail | null) => navigate("/shop-products-details", {state: { product: product }});

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

            <ProductDetails
                product={product}
            />

        </div>
    );
}