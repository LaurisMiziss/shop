import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ProductDetail } from "../../types/products";
import { useSearch } from "../../context/SearchContext";
import { useAuth } from "../../context/AuthContext";
import { useProductList } from "../../hooks/products/useProductList";
import { useDeleteProfile } from "../../hooks/profile/useDeleteProfile";
import { DeleteProfileForm } from "../../components/general/profile/DeleteProfileForm";
import { Navbar } from "../../components/general/Navbar";

export default function ProfileDeletePage() {
    const navigate = useNavigate();
    const { searchQuery, clearSearch } = useSearch();
    const { getProductDetails } = useProductList();
    const [wasChanged, setWasChanged] = useState(false);
    const { isAuthenticated, logout } = useAuth();
    const { password, loading, alert, fieldError, showPassword, removeAlert, onPasswordChange, deleteAccount, togglePassword } = useDeleteProfile();

    const onNavigateToProfile = () => navigate("/profile");

    const onDeleteAccount = async (e: React.FormEvent) => {
        e.preventDefault();

        const res = await deleteAccount();

        if (res) {
            const timeout = setTimeout(() => {
                localStorage.removeItem("token");
                logout();
                navigate("login");
            }, 5000);

            return () => clearTimeout(timeout);
        }
    };

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
        <div className="profile-page-layout">

            <Navbar
                onSearchClick={handleSearchClick}
                onProductClick={handleProductClick}
            />

            <div>

                <DeleteProfileForm
                    password={password}
                    loading={loading}
                    alert={alert}
                    showPassword={showPassword}
                    fieldError={fieldError}
                    removeAlert={removeAlert}
                    onPasswordChange={onPasswordChange}
                    togglePassword={togglePassword}
                    deleteAccount={onDeleteAccount}
                    onNavigateBack={onNavigateToProfile}
                />

            </div>
            
        </div>
    );
}