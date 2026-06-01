import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ProductDetail } from "../../types/products";
import { useSearch } from "../../context/SearchContext";
import { useAuth } from "../../context/AuthContext";
import { useProductList } from "../../hooks/products/useProductList";
import { useChangePassword } from "../../hooks/profile/useChangePassword";
import { ChangePasswordForm } from "../../components/general/profile/ChangePasswordForm";
import { Success } from "../../components/general/success/Success";
import { Navbar } from "../../components/general/Navbar";

export default function ChangePasswordPage() {
    const navigate = useNavigate();
    const { searchQuery, clearSearch } = useSearch();
    const { getProductDetails } = useProductList();
    const [wasChanged, setWasChanged] = useState(false);
    const { isAuthenticated } = useAuth();
    const { 
        oldPassword, newPassword, newRepeatedPassword, loading, showPassword, fieldErrors, alert, removeAlert, onPasswordChange, changePassword, onTogglePassword
    } = useChangePassword();

    const onNavigateToProfile = () => navigate("/profile");

    useEffect(() => {
        if (!isAuthenticated) navigate("/login");
    }, [isAuthenticated]);

    const onSaveButtonClick = async (e: React.FormEvent) => {
        e.preventDefault()

        const res = await changePassword();

        if (res) setWasChanged(true);
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

                {wasChanged ? (
                    <Success
                        message={"Your password was successfully updated"}
                        onNavigateBack={onNavigateToProfile}
                    />
                ) : (
                    <ChangePasswordForm
                        oldPassword={oldPassword}
                        newPassword={newPassword}
                        newRepeatedPassword={newRepeatedPassword}
                        loading={loading}
                        alert={alert}
                        showPassword={showPassword}
                        onTogglePassword={onTogglePassword}
                        removeAlert={removeAlert}
                        passwordFieldErrors={fieldErrors}
                        onPasswordChange={onPasswordChange}
                        onNavigateToProfile={onNavigateToProfile}
                        onSaveButtonClick={onSaveButtonClick}
                    />
                )}

            </div>

        </div>
    );
}