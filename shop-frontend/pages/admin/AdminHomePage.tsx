import "../../components/admin/general/PageList.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useSearch } from "../../context/SearchContext";
import { useProductList } from "../../hooks/products/useProductList";
import { Navbar } from "../../components/general/Navbar";
import { GeneralNavCard } from "../../components/admin/card/GeneralNavCard";

export default function AdminHomePage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { searchQuery, saveQuery, clearSearch } = useSearch();
    const { getProductDetails, getProductsWithFilters } = useProductList();

    const items = [
        { name: "Products", action: () => navigate("/admin-panel-product-list") },
        { name: "Categories", action: () => navigate("/admin-panel-category-list") },
        { name: "Orders", action: () => navigate("/admin-panel-order-list") },
        { name: "Users", action: () => navigate("/admin-panel-user-list") },
    ];

    useEffect(() => {
        if (!user || user.role !== "admin") navigate("/home");
    }, []);

    const onNavigateToProductDetails = async (productId: number | null) => {
        const product = productId ? await getProductDetails(productId) : null;
        navigate("/shop-products-details", {state: { product: product }});
    };

    const handleSearchClick = async () => {
        saveQuery();
        await getProductsWithFilters(searchQuery);
        navigate("/shop-products");
        clearSearch();
    };

    const handleProductClick = async (productId: number) => {
        onNavigateToProductDetails(productId);
        clearSearch();
    };

    return (
        <div className="admin-page-layout">

            <Navbar
                onSearchClick={handleSearchClick}
                onProductClick={handleProductClick}
            />

            <div className="admin-page-content">
            
                <h2>
                    Welcome, {(user && user.full_name.length > 1) ? user.full_name : "worker"}!
                    <br />
                    Have a nice working day!
                </h2>

                {items.map(item => (
                    <GeneralNavCard
                        key={item.name}
                        name={item.name}
                        onNavigate={item.action}
                    />
                ))}

            </div>

        </div>
    );
}